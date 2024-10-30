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
        const result = await db.query(`
          SELECT r.id, r.name, r.description,
                 array_agg(rp.permission_id) as permissions
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

        const roles = result.rows.map(role => ({
          ...role,
          permissions: role.permissions[0] ? role.permissions : []
        }))

        res.status(200).json(roles)
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

        const roleResult = await db.query(
          'INSERT INTO roles (name) VALUES ($1) RETURNING id',
          [name]
        )
        const roleId = roleResult.rows[0].id

        for (let permissionId of permissions) {
          await db.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
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