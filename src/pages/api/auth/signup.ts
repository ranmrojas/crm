import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const { name, email, password, companyName } = req.body
    const db = await getDb()

    // Verificar si el usuario ya existe
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const existingUser = userResult.rows[0]
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10)
    const userInsertResult = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    )
    const userId = userInsertResult.rows[0].id

    // Crear nueva empresa
    const companyInsertResult = await db.query(
      'INSERT INTO companies (name) VALUES ($1) RETURNING id',
      [companyName]
    )
    const companyId = companyInsertResult.rows[0].id

    // Asignar usuario como super_admin
    await db.query(
      'INSERT INTO user_companies (user_id, company_id, role, is_creator) VALUES ($1, $2, $3, $4)',
      [userId, companyId, 'super_admin', true]
    )

    // Crear sucursal principal
    await db.query(
      'INSERT INTO stores (name, company_id, is_main) VALUES ($1, $2, $3)',
      ['Principal', companyId, true]
    )

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      credentials: {
        email,
        companyId
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}