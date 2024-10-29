import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    
    // Verificar acceso a rutas protegidas
    if (req.nextUrl.pathname.startsWith("/api/users") || 
        req.nextUrl.pathname.startsWith("/api/roles") || 
        req.nextUrl.pathname.startsWith("/api/permissions")) {
      
      // Permitir acceso a usuarios autenticados para rutas de usuarios
      if (req.nextUrl.pathname.startsWith("/api/users")) {
        if (!token?.role || (token.role !== "super_admin" && token.role !== "admin")) {
          return new NextResponse(
            JSON.stringify({ message: "No autorizado" }),
            { status: 403, headers: { "content-type": "application/json" } }
          )
        }
      }
      
      // Verificar permisos para roles y permisos
      if ((req.nextUrl.pathname.startsWith("/api/roles") || 
           req.nextUrl.pathname.startsWith("/api/permissions")) && 
          (!token?.role || token.role !== "super_admin")) {
        return new NextResponse(
          JSON.stringify({ message: "Acceso denegado" }),
          { status: 403, headers: { "content-type": "application/json" } }
        )
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/users/:path*',
    '/api/roles/:path*',
    '/api/permissions/:path*'
  ]
}