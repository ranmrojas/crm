import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setMessage('Error en el inicio de sesión. Verifique sus credenciales.')
    } else {
      setMessage('Inicio de sesión exitoso. Redirigiendo...')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <Layout title="Iniciar Sesión">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        ¿No tienes una cuenta? <Link href="/auth/signup"><a>Regístrate aquí</a></Link>
      </p>
    </Layout>
  )
}

export default SignIn