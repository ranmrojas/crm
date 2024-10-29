import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import Layout from '../../components/Layout'
import { useAlert } from '../../context/AlertContext'

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const router = useRouter()
  const { addAlert } = useAlert()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isRegistering) {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, companyName }),
        })

        if (response.ok) {
          const data = await response.json()
          addAlert('success', 'Registro exitoso. Iniciando sesión...')
          
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            companyId: data.credentials.companyId
          })

          if (result?.ok) {
            router.push('/dashboard')
          } else {
            addAlert('error', 'Error al iniciar sesión después del registro')
          }
        } else {
          const error = await response.json()
          addAlert('error', `Error en el registro: ${error.message}`)
        }
      } catch (error) {
        addAlert('error', 'Error en el registro. Por favor, intente nuevamente.')
      }
    } else {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })

        if (result?.error) {
          addAlert('error', 'Error en el inicio de sesión. Verifique sus credenciales.')
        } else if (result?.ok) {
          router.push('/dashboard')
        }
      } catch (error) {
        addAlert('error', 'Error en el inicio de sesión. Por favor, intente nuevamente.')
      }
    }
  }

  return (
    <Layout title={isRegistering ? "Registro" : "Iniciar Sesión"}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isRegistering ? "Registro de Nueva Empresa" : "Iniciar Sesión"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre del Administrador
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nombre de la Empresa
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isRegistering ? "Registrar Empresa" : "Iniciar Sesión"}
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
            <button
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Iniciar sesión" : "Regístrate aquí"}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  )
}