import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })

    if (!session?.user?.role) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    if (session.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de super administrador.' })
    }

    const db = await getDb()

    if (req.method === 'GET') {
      try {
        const roles = await db.all(`
          SELECT r.id, r.name, r.description,
                 GROUP_CONCAT(rp.permission_id) as permissions
          FROM roles r
          LEFT JOIN role_permissions rp ON r.id = rp.role_id
          GROUP BY r.id
          ORDER BY 
            CASE 
              WHEN r.name = 'super_admin' THEN 1
              WHEN r.name = 'admin' THEN 2
              ELSE 3
            END, r.name
        `)

        // Formatear los permisos como array
        const formattedRoles = roles.map(role => ({
          ...role,
          permissions: role.permissions ? role.permissions.split(',').map(Number) : []
        }))

        res.status(200).json(formattedRoles)
      } catch (error) {
        console.error('Error al obtener roles:', error)
        res.status(500).json({ message: 'Error al obtener roles' })
      }
    } else if (req.method === 'POST') {
      try {
        const { name, permissions } = req.body

        if (!name || !permissions || !Array.isArray(permissions)) {
          return res.status(400).json({ message: 'Datos inválidos' })
        }

        const result = await db.run(
          'INSERT INTO roles (name) VALUES (?)',
          [name]
        )
        const roleId = result.lastID

        for (let permissionId of permissions) {
          await db.run(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [roleId, permissionId]
          )
        }

        res.status(201).json({ id: roleId, name, permissions })
      } catch (error) {
        console.error('Error al crear rol:', error)
        res.status(500).json({ message: 'Error al crear rol' })
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