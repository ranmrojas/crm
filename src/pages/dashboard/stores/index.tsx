import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Store = {
  id: number
  name: string
  is_main: boolean
}

const StoresList = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStores()
    }
  }, [status])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const data = await response.json()
        setStores(data)
      } else {
        console.error('Error al obtener las sucursales')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (status === 'loading') {
    return <p>Cargando...</p>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <Layout title="Mis Sucursales">
      <h1>Mis Sucursales</h1>
      {stores.length > 0 ? (
        <ul>
          {stores.map((store) => (
            <li key={store.id}>
              {store.name} {store.is_main && '(Principal)'}
              <Link href={`/dashboard/stores/${store.id}`}>
                <a>Ver detalles</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes sucursales registradas.</p>
      )}
      <Link href="/dashboard/stores/new">
        <a>Crear nueva sucursal</a>
      </Link>
    </Layout>
  )
}

export default StoresList