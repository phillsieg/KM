import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ['/auth/signin', '/api/auth', '/']
        const { pathname } = req.nextUrl
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}