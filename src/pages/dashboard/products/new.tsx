import { useState, useEffect } from 'react'
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
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del Producto:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Precio:
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                Tienda:
              </label>
              <select
                id="store"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Seleccionar tienda</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default NewProduct