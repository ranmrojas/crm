import React, { useState, useEffect } from 'react'
import { useAlert } from '../context/AlertContext'

type Invitation = {
  id: number;
  company_name: string;
  status: string;
}

const ManageInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const { addAlert } = useAlert()

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/invitations')
      if (response.ok) {
        const data = await response.json()
        setInvitations(data)
      } else {
        addAlert('error', 'Error al obtener las invitaciones')
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al obtener las invitaciones')
    }
  }

  const handleInvitationResponse = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        addAlert('success', `Invitación ${status === 'accepted' ? 'aceptada' : 'rechazada'} exitosamente`)
        fetchInvitations()
      } else {
        const error = await response.text()
        addAlert('error', `Error al responder a la invitación: ${error}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al responder a la invitación')
    }
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Invitaciones Pendientes</h3>
      {invitations.length > 0 ? (
        <ul className="space-y-2">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="flex items-center justify-between bg-white p-2 rounded shadow">
              <span>{invitation.company_name}</span>
              <div>
                <button
                  onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleInvitationResponse(invitation.id, 'rejected')}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes invitaciones pendientes.</p>
      )}
    </div>
  )
}

export default ManageInvitations