import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../../../components/Layout'
import { useAlert } from '../../../context/AlertContext'
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  Link2, 
  Palette, 
  Shield, 
  Database, 
  Lock 
} from 'lucide-react'
import { useRouter } from 'next/router'
import InviteUser from '../../../components/InviteUser'
import RoleManagement from '../../../components/RoleManagement'
import TextSizeControl from '../../../components/TextSizeControl'
import { useTextSize } from '../../../context/TextSizeContext'
import UserManagement from '../../../components/UserManagement'

type TabType = {
  id: string
  label: string
  icon: React.ElementType
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general')
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addAlert } = useAlert()
  const { configTextSize } = useTextSize()

  if (status === 'loading') {
    return (
      <Layout title="Cargando...">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const tabs: TabType[] = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'integrations', label: 'Integraciones', icon: Link2 },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'permissions', label: 'Roles y Permisos', icon: Lock }
  ]

  const filteredTabs = session?.user?.role === 'super_admin' 
    ? tabs 
    : tabs.filter(tab => tab.id !== 'permissions')

  const getTextSizeClass = () => {
    switch (configTextSize) {
      case 'xs': return 'text-xs'
      case 'sm': return 'text-sm'
      case 'lg': return 'text-lg'
      default: return 'text-base'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Configuración General</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Información de la Empresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={session?.user?.currentCompany?.name || ''}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <InviteUser />
              </div>
            </div>
          </div>
        )
      case 'users':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>
            <UserManagement />
          </div>
        )
      case 'appearance':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Configuración de Apariencia</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <TextSizeControl type="sidebar" />
              <TextSizeControl type="config" />
            </div>
          </div>
        )
      case 'permissions':
        return session?.user?.role === 'super_admin' ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Roles y Permisos</h2>
            <RoleManagement />
          </div>
        ) : null
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label || activeTab}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-500">Esta sección está en desarrollo...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Layout title="Configuración">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Configuración</h1>
        
        <div className="flex">
          {/* Sidebar de pestañas */}
          <div className="w-1/4 pr-4">
            <nav className="space-y-1">
              {filteredTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 w-full text-left rounded-lg ${getTextSizeClass()} ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="w-3/4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SettingsPage