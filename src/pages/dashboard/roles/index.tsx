import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import RoleManagement from '../../../components/RoleManagement'

const RolesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <p>Cargando...</p>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  // Verificar si el usuario tiene permisos para acceder a esta página
  if (session?.user?.role !== 'super_admin') {
    return (
      <Layout title="Acceso Denegado">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
      </Layout>
    )
  }

  return (
    <Layout title="Gestión de Roles y Permisos">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gestión de Roles y Permisos</h1>
        <RoleManagement />
      </div>
    </Layout>
  )
}

export default RolesPage