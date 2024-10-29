import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'

const Home = () => {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        if (status === 'authenticated') {
          await router.replace('/dashboard')
        } else if (status === 'unauthenticated') {
          await router.replace('/auth/login')
        }
      } catch (error) {
        console.error('Error en redirección:', error)
      }
    }

    handleRedirect()
  }, [status, router])

  // Mostrar pantalla de carga mientras se determina el estado
  return (
    <Layout title="Cargando...">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    </Layout>
  )
}

export default Home