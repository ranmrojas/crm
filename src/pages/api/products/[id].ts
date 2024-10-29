import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const { id } = req.query
  const db = await getDb()

  if (req.method === 'GET') {
    try {
      const product = await db.get('SELECT * FROM products WHERE id = ?', [id])
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(404).json({ message: 'Producto no encontrado' })
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error)
      res.status(500).json({ message: 'Error al obtener el producto' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, price } = req.body
      if (!name || !price) {
        return res.status(400).json({ message: 'Se requieren todos los campos' })
      }

      await db.run(
        'UPDATE products SET name = ?, price = ? WHERE id = ?',
        [name, price, id]
      )

      res.status(200).json({ id, name, price })
    } catch (error) {
      console.error('Error al actualizar el producto:', error)
      res.status(500).json({ message: 'Error al actualizar el producto' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.run('DELETE FROM products WHERE id = ?', [id])
      res.status(200).json({ message: 'Producto eliminado exitosamente' })
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
      res.status(500).json({ message: 'Error al eliminar el producto' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}