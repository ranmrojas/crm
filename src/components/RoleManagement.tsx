import React, { useState, useEffect } from 'react'
import { useAlert } from '../context/AlertContext'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'

type Role = {
  id: number;
  name: string;
  permissions: number[];
}

type Permission = {
  id: number;
  name: string;
  description: string;
  category: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const { addAlert } = useAlert()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.role === 'super_admin') {
      fetchRoles()
      fetchPermissions()
    }
  }, [session])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/roles', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      } else {
        const errorData = await response.json()
        addAlert('error', `Error al cargar los roles: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al cargar los roles')
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        // Extraer la categoría del nombre del permiso (antes del punto)
        const processedData = data.map((p: any) => ({
          ...p,
          category: p.name.split('.')[0]
        }))
        setPermissions(processedData)
      } else {
        const errorData = await response.json()
        addAlert('error', `Error al cargar los permisos: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al cargar los permisos')
    }
  }

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoleName.trim()) {
      addAlert('error', 'El nombre del rol es requerido')
      return
    }

    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newRoleName,
          permissions: [] 
        }),
        credentials: 'include'
      })

      if (response.ok) {
        const newRole = await response.json()
        setRoles([...roles, newRole])
        setNewRoleName('')
        setShowModal(false)
        addAlert('success', 'Rol creado exitosamente')
      } else {
        const errorData = await response.json()
        addAlert('error', `Error al crear el rol: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al crear el rol')
    }
  }

  const handlePermissionToggle = async (roleId: number, permissionId: number) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    const updatedPermissions = role.permissions.includes(permissionId)
      ? role.permissions.filter(id => id !== permissionId)
      : [...role.permissions, permissionId]

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: role.name,
          permissions: updatedPermissions
        }),
        credentials: 'include'
      })

      if (response.ok) {
        setRoles(roles.map(r => 
          r.id === roleId 
            ? { ...r, permissions: updatedPermissions }
            : r
        ))
        addAlert('success', 'Permisos actualizados exitosamente')
      } else {
        const errorData = await response.json()
        addAlert('error', `Error al actualizar permisos: ${errorData.message}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al actualizar permisos')
    }
  }

  // Obtener categorías únicas
  const categories = Array.from(new Set(permissions.map(p => p.category)))

  // Filtrar permisos según búsqueda y categoría
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'todas' || permission.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Agrupar permisos por categoría
  const groupedPermissions = filteredPermissions.reduce((groups: { [key: string]: Permission[] }, permission) => {
    const category = permission.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(permission)
    return groups
  }, {})

  const formatCategory = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'security': 'Seguridad',
      'company': 'Empresa',
      'users': 'Usuarios',
      'stores': 'Sucursales',
      'products': 'Productos',
      'inventory': 'Inventario',
      'sales': 'Ventas',
      'purchases': 'Compras',
      'customers': 'Clientes',
      'suppliers': 'Proveedores',
      'settings': 'Configuración',
      'reports': 'Reportes',
      'audit': 'Auditoría',
      'roles': 'Roles'
    }
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (loading) {
    return <div className="flex justify-center items-center">Cargando...</div>
  }

  if (session?.user?.role !== 'super_admin') {
    return <div>No tienes permisos para acceder a esta sección.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <select
          value={selectedRole?.id || ''}
          onChange={(e) => setSelectedRole(roles.find(r => r.id === Number(e.target.value)) || null)}
          className="w-64 p-2 border rounded"
        >
          <option value="">Seleccionar Rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Rol
        </button>
      </div>

      {selectedRole && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Permisos para {selectedRole.name}</h3>
          
          {/* Filtros y Búsqueda */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar permisos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategory(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Permisos Agrupados */}
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <div key={category} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h4 className="font-medium text-gray-700">{formatCategory(category)}</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(selectedRole.id, permission.id)}
                        className="rounded border-gray-300"
                        disabled={selectedRole.name === 'super_admin'}
                      />
                      <div>
                        <p className="text-sm text-gray-700">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Crear Nuevo Rol</h3>
            <form onSubmit={handleCreateRole}>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Nombre del rol"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagement