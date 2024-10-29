import React, { ReactNode } from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Sidebar from './Sidebar'

// Importar la versión del package.json
const version = process.env.npm_package_version || '0.0.0.82'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'CRM Multi-tienda' }: Props) => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      {session && <Sidebar />}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <footer className="text-center py-1 text-xs text-gray-500">
          CRM v{version} &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}

export default Layout