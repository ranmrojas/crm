import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })

    if (!session) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    // Verificar si el usuario tiene el rol adecuado
    if (session.user.role !== 'super_admin' && session.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' })
    }

    const db = await getDb()

    if (req.method === 'GET') {
      try {
        const companyId = session.user.currentCompany?.id;

        if (!companyId) {
          return res.status(400).json({ message: 'No se encontró la empresa actual' });
        }

        // Consulta para obtener usuarios según el rol
        const query = session.user.role === 'super_admin'
          ? `
            SELECT u.id, u.name, u.email, uc.role 
            FROM users u
            JOIN user_companies uc ON u.id = uc.user_id
            WHERE uc.company_id = ?
          `
          : `
            SELECT u.id, u.name, u.email, uc.role 
            FROM users u
            JOIN user_companies uc ON u.id = uc.user_id
            WHERE uc.company_id = ? AND uc.role != 'super_admin'
          `;

        const users = await db.all(query, [companyId]);
        res.status(200).json(users)
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
        res.status(500).json({ message: 'Error al obtener usuarios' })
      }
    } else if (req.method === 'POST') {
      try {
        const { name, email, password, role } = req.body
        const companyId = session.user.currentCompany?.id

        if (!name || !email || !password || !role || !companyId) {
          return res.status(400).json({ message: 'Faltan campos requeridos' })
        }

        // Verificar si el email ya existe
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email])
        if (existingUser) {
          return res.status(400).json({ message: 'El email ya está registrado' })
        }

        // Verificar permisos para crear roles específicos
        if (session.user.role !== 'super_admin' && role === 'admin') {
          return res.status(403).json({ message: 'No puedes crear usuarios administradores' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Iniciar transacción
        await db.run('BEGIN TRANSACTION')

        try {
          // Crear usuario
          const userResult = await db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
          )

          // Asignar usuario a la empresa con el rol especificado
          await db.run(
            'INSERT INTO user_companies (user_id, company_id, role) VALUES (?, ?, ?)',
            [userResult.lastID, companyId, role]
          )

          await db.run('COMMIT')

          res.status(201).json({
            id: userResult.lastID,
            name,
            email,
            role
          })
        } catch (error) {
          await db.run('ROLLBACK')
          throw error
        }
      } catch (error) {
        console.error('Error al crear usuario:', error)
        res.status(500).json({ message: 'Error al crear usuario' })
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error en el handler:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}