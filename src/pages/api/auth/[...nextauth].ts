import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDb } from '../../../services/db'
import bcrypt from 'bcryptjs'
import { User } from 'next-auth'

interface CustomUser extends User {
  id: string
  email: string
  name: string
  role: string
  companies: any[]
  currentCompany: {
    id: string
    name: string
  }
  currentStore: {
    id: string
    name: string
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const db = await getDb()
          
          const result = await db.query(`
            SELECT u.*, uc.role, uc.is_creator, c.id as company_id, c.name as company_name,
                   s.id as store_id, s.name as store_name
            FROM users u 
            LEFT JOIN user_companies uc ON u.id = uc.user_id 
            LEFT JOIN companies c ON uc.company_id = c.id
            LEFT JOIN stores s ON c.id = s.company_id AND s.is_main = true
            WHERE u.email = $1
          `, [credentials.email])

          const user = result.rows[0]

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          let role = 'user'
          if (user.is_creator) {
            role = 'super_admin'
          } else if (user.role) {
            role = user.role
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: role,
            companies: [], // Array vacío por defecto
            currentCompany: {
              id: user.company_id?.toString(),
              name: user.company_name
            },
            currentStore: {
              id: user.store_id?.toString(),
              name: user.store_name
            }
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.currentCompany = user.currentCompany
        token.currentStore = user.currentStore
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.currentCompany = token.currentCompany
        session.user.currentStore = token.currentStore
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60
  }
})