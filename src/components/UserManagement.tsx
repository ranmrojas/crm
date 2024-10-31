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

const UserManagement: React.FC = () => {
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

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        addAlert('success', 'Usuario eliminado exitosamente')
        fetchUsers()
      } else {
        const errorData = await response.json()
        addAlert('error', `Error al eliminar usuario: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al eliminar usuario')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="usuariojr">Usuario Jr</option>
          </select>
        </div>
        <button
          onClick={() => {
            setEditingUser(null)
            setFormData({ name: '', email: '', password: '', role: 'usuariojr' })
            setShowModal(true)
          }}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'vendedor' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {user.role === 'admin' ? 'Administrador' :
                     user.role === 'vendedor' ? 'Vendedor' :
                     user.role === 'usuariojr' ? 'Usuario Jr' : user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingUser(user)
                      setFormData({
                        name: user.name,
                        email: user.email,
                        password: '',
                        role: user.role
                      })
                      setShowModal(true)
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!editingUser}
                    className="mt-1 block w-full rounded-md border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300"
                  >
                    {session?.user?.role === 'super_admin' && (
                      <option value="admin">Administrador</option>
                    )}
                    <option value="vendedor">Vendedor</option>
                    <option value="usuariojr">Usuario Jr</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement