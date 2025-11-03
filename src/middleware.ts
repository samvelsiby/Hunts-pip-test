import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/user(.*)',
  '/api/billing(.*)',
  '/api/checkout(.*)',
  '/library/protected(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
      unauthorizedUrl: new URL('/sign-in', req.url).toString(),
    })
  }
  
  if (isAdminRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
      unauthorizedUrl: new URL('/sign-in', req.url).toString(),
    })
    // TODO: Add admin role check when we implement user roles
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
