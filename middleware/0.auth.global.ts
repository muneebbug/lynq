export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  const isAuthenticated = status.value === 'authenticated'
  const authDisabledPaths = ['/auth/login', '/']
  if (authDisabledPaths.includes(to.path)) {
    if (isAuthenticated) {
      return navigateTo('/')
    }
  }
  else {
    if (!isAuthenticated) {
      return navigateTo('/auth/login')
    }
  }
  return true
})
