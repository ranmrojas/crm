import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || session.user?.role !== 'super_admin') {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const { id } = req.query
  const db = await getDb()

  if (req.method === 'PUT') {
    try {
      const { name, permissions } = req.body

      // Verificar que no se esté modificando el rol super_admin
      const roleResult = await db.query('SELECT * FROM roles WHERE id = $1', [id])
      const role = roleResult.rows[0]
      
      if (role.name === 'super_admin') {
        return res.status(403).json({ message: 'No se puede modificar el rol super_admin' })
      }

      await db.query('UPDATE roles SET name = $1 WHERE id = $2', [name, id])
      await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id])

      for (let permissionId of permissions) {
        await db.query(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
          [id, permissionId]
        )
      }

      res.status(200).json({ id, name, permissions })
    } catch (error) {
      console.error('Error al actualizar rol:', error)
      res.status(500).json({ message: 'Error al actualizar rol' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Verificar que no se esté eliminando el rol super_admin
      const roleResult = await db.query('SELECT * FROM roles WHERE id = $1', [id])
      const role = roleResult.rows[0]
      
      if (role.name === 'super_admin') {
        return res.status(403).json({ message: 'No se puede eliminar el rol super_admin' })
      }

      await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id])
      await db.query('DELETE FROM roles WHERE id = $1', [id])
      res.status(200).json({ message: 'Rol eliminado exitosamente' })
    } catch (error) {
      console.error('Error al eliminar rol:', error)
      res.status(500).json({ message: 'Error al eliminar rol' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}