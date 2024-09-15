// middleware/auth.ts
import {
  publicRoutes,
  authRoutes,
  protectedRoutes,
  checkRoutesPrefix,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT_URL,
} from '@/lib/routes'

export default defineNuxtRouteMiddleware(async (to) => {
  const { status } = useAuth()
  const isAuthenticated = status.value === 'authenticated'

  const isApiAuthRoute = to.path.startsWith(apiAuthPrefix)
  const isCheckRoute = to.path.startsWith(checkRoutesPrefix)
  const isProtectedRoute = protectedRoutes.includes(to.path)
  const isPublicRoute = publicRoutes.includes(to.path)
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

  // Handle Check Routes
  const slugRoute = to.path.split('/').pop()
  if (!isPublicRoute && !isProtectedRoute && !isCheckRoute) return
})
