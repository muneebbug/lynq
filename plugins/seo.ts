/**
 * Global SEO plugin that sets default metadata for routes
 * This handles routes that don't have explicit SEO settings
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const route = useRoute()

    // Apply default SEO if no specific meta is set
    setRouteDefaultSeo(route)

    // Watch for route changes and update SEO accordingly
    watch(() => route.path, (newPath) => {
      setRouteDefaultSeo(route)
    })
  })
})

/**
 * Sets default SEO metadata based on the current route
 */
function setRouteDefaultSeo(route: any) {
  // Skip if we're on a page that already sets its own SEO
  if (document.querySelector('meta[data-seo-managed]')) return

  // Generate a title from the route path
  const pathSegments = route.path.split('/').filter(segment => segment.length > 0)

  // If no path segments, we're on the homepage (which should have its own SEO)
  if (pathSegments.length === 0) return

  // Format the last segment as the page title
  const lastSegment = pathSegments[pathSegments.length - 1]
  const formattedTitle = lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Set default SEO for this route
  useSeo({
    title: formattedTitle,
    description: `${formattedTitle} - Lynq URL Shortener`,
    noIndex: route.path.includes('/dashboard') || route.path.includes('/auth'), // Don't index private pages
  })

  // Mark this as managed by the plugin
  const metaElement = document.createElement('meta')
  metaElement.setAttribute('data-seo-managed', 'true')
  metaElement.setAttribute('content', 'default-seo')
  document.head.appendChild(metaElement)
}
