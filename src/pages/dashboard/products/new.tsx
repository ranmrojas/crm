import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { useAlert } from '../../../context/AlertContext'
import { useSession } from 'next-auth/react'

const NewProduct = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [storeId, setStoreId] = useState('')
  const [stores, setStores] = useState<{ id: number; name: string }[]>([])
  const router = useRouter()
  const { addAlert } = useAlert()
  const { data: session, status } = useSession()

  useState(() => {
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
        if (data.length > 0) {
          setStoreId(data[0].id.toString())
        }
      } else {
        addAlert('error', 'Error al obtener las tiendas')
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al obtener las tiendas')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price), storeId: parseInt(storeId) }),
      })

      if (response.ok) {
        addAlert('success', 'Producto creado exitosamente')
        router.push('/dashboard/products')
      } else {
        const error = await response.text()
        addAlert('error', `Error al crear el producto: ${error}`)
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al crear el producto')
    }
  }

  if (status === 'loading') {
    return <p>Cargando...</p>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  return (
    <Layout title="Nuevo Producto">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Nombre del Producto:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="price" className="block mb-1">Precio:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="store" className="block mb-1">Tienda:</label>
          <select
            id="store"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Crear Producto
        </button>
      </form>
    </Layout>
  )
}

export default NewProduct