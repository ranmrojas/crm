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
      const role = await db.get('SELECT * FROM roles WHERE id = ?', [id])
      if (role.name === 'super_admin') {
        return res.status(403).json({ message: 'No se puede modificar el rol super_admin' })
      }

      await db.run('UPDATE roles SET name = ? WHERE id = ?', [name, id])
      await db.run('DELETE FROM role_permissions WHERE role_id = ?', [id])

      for (let permissionId of permissions) {
        await db.run(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
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
      const role = await db.get('SELECT * FROM roles WHERE id = ?', [id])
      if (role.name === 'super_admin') {
        return res.status(403).json({ message: 'No se puede eliminar el rol super_admin' })
      }

      await db.run('DELETE FROM role_permissions WHERE role_id = ?', [id])
      await db.run('DELETE FROM roles WHERE id = ?', [id])
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