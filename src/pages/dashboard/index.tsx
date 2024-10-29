import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { Store, Package, Users, Settings } from 'lucide-react'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        if (status === 'unauthenticated' && isMounted) {
          await router.push('/auth/login')
        } else if (status === 'authenticated' && isMounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error en la navegación:', error)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [status, router])

  if (isLoading || status === 'loading') {
    return (
      <Layout title="Cargando Dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return null
  }

  const menuItems = [
    {
      icon: Store,
      title: 'Sucursales',
      description: 'Gestiona tus sucursales',
      href: '/dashboard/stores',
      color: 'bg-blue-500'
    },
    {
      icon: Package,
      title: 'Productos',
      description: 'Administra tu inventario',
      href: '/dashboard/products',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Usuarios',
      description: 'Gestión de usuarios',
      href: '/dashboard/users',
      color: 'bg-purple-500',
      adminOnly: true
    },
    {
      icon: Settings,
      title: 'Configuración',
      description: 'Ajustes del sistema',
      href: '/dashboard/settings',
      color: 'bg-gray-500'
    }
  ]

  const filteredMenuItems = session.user?.role === 'super_admin' 
    ? menuItems 
    : menuItems.filter(item => !item.adminOnly)

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {session.user?.name}
          </h1>
          <p className="mt-2 text-gray-600">
            {session.user?.currentCompany?.name} - {session.user?.currentStore?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <a className="block group">
                <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className={`inline-flex p-3 rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard