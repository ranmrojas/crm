import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token') // Suponiendo que el token está en las cookies

  // Verificar si el usuario está autenticado
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Verificar permisos para roles y permisos
  if ((req.nextUrl.pathname.startsWith('/api/roles') || 
       req.nextUrl.pathname.startsWith('/api/permissions')) && 
      (!token.role || token.role !== 'super_admin')) {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/roles/:path*',
    '/api/permissions/:path*'
  ],
}