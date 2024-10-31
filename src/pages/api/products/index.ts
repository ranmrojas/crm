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
      const { storeId } = req.query
      if (!storeId) {
        return res.status(400).json({ message: 'Se requiere el ID de la tienda' })
      }

      const result = await db.query('SELECT * FROM products WHERE store_id = $1', [storeId])
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error al obtener los productos:', error)
      res.status(500).json({ message: 'Error al obtener los productos' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, price, storeId } = req.body
      if (!name || !price || !storeId) {
        return res.status(400).json({ message: 'Se requieren todos los campos' })
      }

      const result = await db.query(
        'INSERT INTO products (name, price, store_id) VALUES ($1, $2, $3) RETURNING *',
        [name, price, storeId]
      )

      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Error al crear el producto:', error)
      res.status(500).json({ message: 'Error al crear el producto' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}