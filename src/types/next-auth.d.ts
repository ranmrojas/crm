import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      companies: any[]
      currentCompany: any
      currentStore: any
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    companies: any[]
    currentCompany: any
    currentStore: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    companies: any[]
    currentCompany: any
    currentStore: any
  }
}