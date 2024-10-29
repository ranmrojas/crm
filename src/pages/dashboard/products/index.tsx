import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { useAlert } from '../../../context/AlertContext'
import { Plus, Search, ChevronDown, ChevronUp, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

type Product = {
  id: number
  name: string
  price: number
  store_id: number
}

type Store = {
  id: number
  name: string
}

export default function ProductosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addAlert } = useAlert()
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof Product>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStores()
    }
  }, [status])

  useEffect(() => {
    if (selectedStore) {
      fetchProducts(selectedStore)
    }
  }, [selectedStore])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const data = await response.json()
        setStores(data)
        if (data.length > 0) {
          setSelectedStore(data[0].id.toString())
        }
      } else {
        addAlert('error', 'Error al obtener las tiendas')
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al obtener las tiendas')
    }
  }

  const fetchProducts = async (storeId: string) => {
    try {
      const response = await fetch(`/api/products?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        addAlert('error', 'Error al obtener los productos')
      }
    } catch (error) {
      addAlert('error', 'Error de conexión al obtener los productos')
    }
  }

  const handleSort = (column: keyof Product) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading') {
    return <p>Cargando...</p>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  return (
    <Layout title="Productos">
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg p-3 mb-4">
            <h1 className="text-lg font-medium text-gray-800 mb-2">Gestión de Productos</h1>
            <div className="h-px bg-gray-200 mt-1 mb-3"></div>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-2 py-1 text-sm w-full h-8 border rounded"
                />
              </div>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-[140px] h-8 text-sm border rounded"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
              <Link href="/dashboard/products/new">
                <a className="bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center">
                  <Plus className="w-3 h-3 mr-1" /> Agregar
                </a>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Nombre
                    {sortColumn === 'name' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    Precio
                    {sortColumn === 'price' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />)}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <a className="text-indigo-600 hover:text-indigo-900 mr-2">
                          <Edit className="w-4 h-4" />
                        </a>
                      </Link>
                      <button
                        onClick={() => {/* Implementar lógica de eliminación */}}
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
        </div>
      </div>
    </Layout>
  )
}