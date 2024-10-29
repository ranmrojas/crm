import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  if (session.user.role !== 'super_admin' && session.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' })
  }

  const { id } = req.query
  const db = await getDb()

  // Verificar que el usuario pertenece a la misma empresa
  const userCompany = await db.get(`
    SELECT uc.role 
    FROM user_companies uc
    WHERE uc.user_id = ? AND uc.company_id = ?
  `, [id, session.user.currentCompany?.id])

  if (!userCompany) {
    return res.status(404).json({ message: 'Usuario no encontrado en esta empresa' })
  }

  // No permitir modificar super_admin si no eres super_admin
  if (userCompany.role === 'super_admin' && session.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'No tienes permisos para modificar este usuario' })
  }

  if (req.method === 'PUT') {
    try {
      const { name, email, role, password } = req.body

      let updateQuery = 'UPDATE users SET name = ?, email = ?'
      let params = [name, email]

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        updateQuery += ', password = ?'
        params.push(hashedPassword)
      }

      updateQuery += ' WHERE id = ?'
      params.push(id)

      await db.run(updateQuery, params)

      // Actualizar rol si se proporciona y es diferente
      if (role && role !== userCompany.role) {
        await db.run(`
          UPDATE user_companies 
          SET role = ? 
          WHERE user_id = ? AND company_id = ?
        `, [role, id, session.user.currentCompany?.id])
      }

      res.status(200).json({ message: 'Usuario actualizado exitosamente' })
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      res.status(500).json({ message: 'Error al actualizar usuario' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Eliminar la relación con la empresa
      await db.run(`
        DELETE FROM user_companies 
        WHERE user_id = ? AND company_id = ?
      `, [id, session.user.currentCompany?.id])

      // Verificar si el usuario pertenece a otras empresas
      const otherCompanies = await db.get(`
        SELECT COUNT(*) as count 
        FROM user_companies 
        WHERE user_id = ?
      `, [id])

      // Si no pertenece a otras empresas, eliminar el usuario
      if (otherCompanies.count === 0) {
        await db.run('DELETE FROM users WHERE id = ?', [id])
      }

      res.status(200).json({ message: 'Usuario eliminado exitosamente' })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      res.status(500).json({ message: 'Error al eliminar usuario' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}