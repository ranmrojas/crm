import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName, storeName }),
      })

      if (response.ok) {
        setMessage('Registro exitoso. Redirigiendo al inicio de sesión...')
        setTimeout(() => router.push('/auth/signin'), 2000)
      } else {
        const error = await response.text()
        setMessage(`Error en el registro: ${error}`)
      }
    } catch (error) {
      setMessage('Error en el registro. Por favor, intente nuevamente.')
    }
  }

  return (
    <Layout title="Registro">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre completo:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="companyName">Nombre de la empresa:</label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="storeName">Nombre de la sucursal principal:</label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        ¿Ya tienes una cuenta? <Link href="/auth/signin"><a>Inicia sesión aquí</a></Link>
      </p>
    </Layout>
  )
}

export default SignUp