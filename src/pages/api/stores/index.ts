import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const db = await getDb()

  if (req.method === 'GET') {
    try {
      const userId = parseInt(session.user.id as string)
      const result = await db.query(`
        SELECT stores.* 
        FROM stores 
        JOIN companies ON stores.company_id = companies.id 
        WHERE companies.user_id = $1
      `, [userId])
      
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error al obtener las sucursales:', error)
      res.status(500).json({ message: 'Error al obtener las sucursales' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body
      const userId = parseInt(session.user.id as string)
      
      // Obtener la compañía del usuario
      const companyResult = await db.query(
        'SELECT id FROM companies WHERE user_id = $1',
        [userId]
      )
      
      if (!companyResult.rows[0]) {
        return res.status(400).json({ message: 'No se encontró la empresa del usuario' })
      }

      const result = await db.query(
        'INSERT INTO stores (name, company_id, is_main) VALUES ($1, $2, $3) RETURNING *',
        [name, companyResult.rows[0].id, false]
      )

      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Error al crear la sucursal:', error)
      res.status(500).json({ message: 'Error al crear la sucursal' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}