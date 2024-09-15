export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  const isAuthenticated = status.value === 'authenticated'
  const authDisabledPaths = ['/auth/login', '/']

  // If user is authenticated and trying to access an authDisabledPath, redirect to '/'
  if (authDisabledPaths.includes(to.path)) {
    if (isAuthenticated && to.path !== '/') {
      return navigateTo('/')
    }
  }
  else {
    // If user is not authenticated and trying to access a protected route, redirect to '/auth/login'
    if (!isAuthenticated && to.path !== '/auth/login') {
      return navigateTo('/auth/login')
    }
  }

  return true
})
