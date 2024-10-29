import React, { useState, useEffect } from 'react'
import { useAlert } from '../context/AlertContext'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'usuariojr'
  })
  const { addAlert } = useAlert()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.currentCompany?.id) {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        const errorData = await response.json()
        addAlert('error', `Error al cargar los usuarios: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al cargar los usuarios')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        addAlert('success', `Usuario ${editingUser ? 'actualizado' : 'creado'} exitosamente`)
        setShowModal(false)
        setEditingUser(null)
        setFormData({ name: '', email: '', password: '', role: 'usuariojr' })
        fetchUsers()
      } else {
        const errorData = await response.json()
        addAlert('error', `Error: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', `Error de conexión`)
    }
  }

  // ... resto del código del componente permanece igual ...
}