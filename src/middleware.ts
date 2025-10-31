import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/me',
  '/api/tv/username',
  '/api/billing/portal',
  '/api/checkout',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', req.url),
      unauthorizedUrl: new URL('/sign-in', req.url),
    })
  }
  
  if (isAdminRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', req.url),
      unauthorizedUrl: new URL('/sign-in', req.url),
    })
    // TODO: Add admin role check when we implement user roles
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
