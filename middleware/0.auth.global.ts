// middleware/auth.ts
import {
  authRoutes,
  protectedRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT_URL,
} from '@/lib/routes'

export default defineNuxtRouteMiddleware(async (to) => {
  const { status } = useAuth()
  const isAuthenticated = status.value === 'authenticated'

  const isApiAuthRoute = to.path.startsWith(apiAuthPrefix)
  const isProtectedRoute = protectedRoutes.includes(to.path)
  const isAuthRoute = authRoutes.includes(to.path)

  // Skip API routes
  if (isApiAuthRoute) {
    return
  }

  // Handle Auth Routes
  if (isAuthRoute) {
    if (isAuthenticated) {
      return navigateTo(DEFAULT_LOGIN_REDIRECT_URL)
    }
    return
  }

  // Handle Protected Routes
  if (isProtectedRoute && !isAuthenticated) {
    const callbackUrl = to.fullPath
    return navigateTo(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  // Short link handling now happens at the server level in server/middleware/redirect.ts
})
