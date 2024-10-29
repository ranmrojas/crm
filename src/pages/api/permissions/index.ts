import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })

    if (!session?.user?.role) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    // Solo permitir super_admin
    if (session.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de super administrador.' })
    }

    const db = await getDb()

    if (req.method === 'GET') {
      try {
        // Obtener todos los permisos ordenados por nombre
        const permissions = await db.all(`
          SELECT id, name, description 
          FROM permissions 
          ORDER BY 
            CASE 
              WHEN name LIKE 'security.%' THEN 1
              WHEN name LIKE 'company.%' THEN 2
              WHEN name LIKE 'users.%' THEN 3
              ELSE 4 
            END,
            name
        `)
        
        res.status(200).json(permissions)
      } catch (error) {
        console.error('Error al obtener permisos:', error)
        res.status(500).json({ message: 'Error al obtener permisos' })
      }
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error en el handler:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}