/**
 * Composable for managing SEO meta tags across the application
 * Follows industry standards for OpenGraph, Twitter Cards, and basic SEO
 */
interface SeoMeta {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
}

export const useSeo = (meta: SeoMeta = {}) => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const baseUrl = config.public.APP_BASE_URL || ''

  // Get the canonical URL
  const canonicalUrl = meta.url || `${baseUrl}${route.path}`

  // Default title based on route if not provided
  const pageTitle = meta.title || route.meta.title || 'Lynq'

  // Set page title and meta information using defineHead instead
  useHead({
    title: pageTitle,
    meta: [
      { key: 'description', name: 'description', content: String(meta.description || 'Lynq - A modern URL shortener with powerful analytics and customization features') },
      { key: 'data-seo-managed', name: 'data-seo-managed', content: 'true' },
      { key: 'og-title', property: 'og:title', content: String(pageTitle) },
      { key: 'og-description', property: 'og:description', content: String(meta.description || 'Lynq - A modern URL shortener with powerful analytics and customization features') },
      { key: 'og-url', property: 'og:url', content: String(canonicalUrl) },
      { key: 'og-type', property: 'og:type', content: String(meta.type || 'website') },
      { key: 'og-image', property: 'og:image', content: String(meta.image || '/images/lynq.jpg') },
      { key: 'twitter-title', name: 'twitter:title', content: String(pageTitle) },
      { key: 'twitter-description', name: 'twitter:description', content: String(meta.description || 'Lynq - A modern URL shortener with powerful analytics and customization features') },
      { key: 'twitter-image', name: 'twitter:image', content: String(meta.image || '/images/lynq.jpg') },
      ...(meta.noIndex ? [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }] : []),
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  })
}
