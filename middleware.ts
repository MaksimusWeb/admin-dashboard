import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Дополнительная логика если нужна
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = { 
  matcher: ['/users/:path*', '/analytics/:path*', '/settings/:path*'] 
}