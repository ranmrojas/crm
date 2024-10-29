import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        include: {
          companies: {
            include: {
              stores: {
                include: {
                  products: true
                }
              }
            }
          }
        }
      })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los datos' })
    } finally {
      await prisma.$disconnect()
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}