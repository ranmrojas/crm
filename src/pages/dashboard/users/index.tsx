import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import UserManagement from '../../../components/UserManagement'

const UsersPage = () => {
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
  if (session?.user?.role !== 'super_admin' && session?.user?.role !== 'admin') {
    return (
      <Layout title="Acceso Denegado">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
      </Layout>
    )
  }

  return (
    <Layout title="Gestión de Usuarios">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
        <UserManagement />
      </div>
    </Layout>
  )
}

export default UsersPage