import React, { useState, useEffect } from 'react'
import { useAlert } from '../context/AlertContext'
import { useSession } from 'next-auth/react'

const InviteUser: React.FC = () => {
  const [email, setEmail] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const { addAlert } = useAlert()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.companies && session.user.companies.length > 0) {
      setSelectedCompany(session.user.companies[0].id.toString())
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: selectedCompany, inviteeEmail: email }),
      })

      if (response.ok) {
        addAlert('success', 'Invitación enviada exitosamente')
        setEmail('')
      } else {
        const error = await response.text()
        addAlert('error', `Error al enviar la invitación: ${error}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al enviar la invitación')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Invitar Usuario</h3>
      <div className="flex flex-col space-y-2">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="p-2 border rounded"
        >
          {session?.user?.companies?.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Invitar
        </button>
      </div>
    </form>
  )
}

export default InviteUser