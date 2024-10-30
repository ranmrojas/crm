import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getDb } from '../../../services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const db = await getDb()

  if (req.method === 'POST') {
    try {
      const { companyId, inviteeEmail } = req.body
      const inviterId = session.user.id

      // Verificar permisos
      const userCompanyResult = await db.query(
        'SELECT * FROM user_companies WHERE user_id = $1 AND company_id = $2',
        [inviterId, companyId]
      )
      const userCompany = userCompanyResult.rows[0]

      if (!userCompany || !['admin', 'super_admin'].includes(userCompany.role)) {
        return res.status(403).json({ message: 'No tienes permisos para invitar usuarios a esta empresa' })
      }

      // Crear la invitación
      const result = await db.query(
        'INSERT INTO invitations (company_id, inviter_id, invitee_email, token, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [companyId, inviterId, inviteeEmail, Math.random().toString(36).substring(7), 'pending']
      )

      res.status(201).json({ id: result.rows[0].id, message: 'Invitación enviada exitosamente' })
    } catch (error) {
      console.error('Error al enviar la invitación:', error)
      res.status(500).json({ message: 'Error al enviar la invitación' })
    }
  } else if (req.method === 'GET') {
    try {
      const result = await db.query(
        'SELECT i.*, c.name as company_name FROM invitations i JOIN companies c ON i.company_id = c.id WHERE i.invitee_email = $1',
        [session.user.email]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error al obtener las invitaciones:', error)
      res.status(500).json({ message: 'Error al obtener las invitaciones' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}