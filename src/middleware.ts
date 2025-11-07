import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/user(.*)',
  '/api/billing(.*)',
  '/api/checkout(.*)',
  '/library/protected(.*)',
])

const isWebhookRoute = createRouteMatcher([
  '/api/webhooks(.*)',
  '/api/custom-webhook',
  '/api/revalidate(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for webhook routes
  if (isWebhookRoute(req)) {
    return
  }

  // For API routes, return JSON error instead of redirecting
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')
  
  if (isProtectedRoute(req)) {
    if (isApiRoute) {
      // For API routes, check auth and return JSON error if not authenticated
      const { userId } = await auth()
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized', success: false }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    } else {
      // For page routes, redirect to sign-in
      await auth.protect({
        unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
        unauthorizedUrl: new URL('/sign-in', req.url).toString(),
      })
    }
  }
  
  if (isAdminRoute(req)) {
    if (isApiRoute) {
      const { userId } = await auth()
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized', success: false }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    } else {
      await auth.protect({
        unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
        unauthorizedUrl: new URL('/sign-in', req.url).toString(),
      })
    }
    // TODO: Add admin role check when we implement user roles
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
