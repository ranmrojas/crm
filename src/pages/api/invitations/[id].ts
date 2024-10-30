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

  if (req.method === 'PUT') {
    try {
      const { status } = req.body

      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Estado de invitación inválido' })
      }

      const invitationResult = await db.query(
        'SELECT * FROM invitations WHERE id = $1',
        [id]
      )
      const invitation = invitationResult.rows[0]

      if (!invitation) {
        return res.status(404).json({ message: 'Invitación no encontrada' })
      }

      if (invitation.invitee_email !== session.user.email) {
        return res.status(403).json({ message: 'No tienes permiso para responder a esta invitación' })
      }

      await db.query(
        'UPDATE invitations SET status = $1 WHERE id = $2',
        [status, id]
      )

      if (status === 'accepted') {
        // Agregar al usuario a la empresa
        await db.query(
          'INSERT INTO user_companies (user_id, company_id, role) VALUES ($1, $2, $3)',
          [session.user.id, invitation.company_id, 'user']
        )
      }

      res.status(200).json({ 
        message: `Invitación ${status === 'accepted' ? 'aceptada' : 'rechazada'} exitosamente` 
      })
    } catch (error) {
      console.error('Error al responder a la invitación:', error)
      res.status(500).json({ message: 'Error al responder a la invitación' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}