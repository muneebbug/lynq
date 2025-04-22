import { prisma } from '@/server/prisma'
import { parseUserAgent } from '@/lib/analytics'

export default defineEventHandler(async (event) => {
  const BLACKLISTED_PATHS = ['/api', '/auth', '/dashboard', '/docs', '/verify', '/check', '/register']

  const path = getRequestURL(event).pathname
  console.log('🚧 Path:', path)

  // Skip non-root paths or blacklisted paths
  const segments = path.split('/').filter(Boolean)
  if (segments.length !== 1 || BLACKLISTED_PATHS.some(p => path.startsWith(p))) {
    return
  }

  const slug = segments[0]
  console.log('🚧 Short link detected:', slug)

  try {
    // Find the link in the database directly using Prisma
    const link = await prisma.links.findUnique({
      where: {
        slug,
      },
    })

    // If the link doesn't exist, continue to normal routing
    if (!link) {
      console.log('🚧 Link not found for slug:', slug)
      return
    }

    console.log('🚧 Found link, redirecting to:', link.url)

    // Get request headers for analytics
    const headers = getRequestHeaders(event)
    const userAgent = headers['user-agent'] || ''
    const referer = headers['referer'] || ''
    const ip = headers['x-forwarded-for'] || getRequestIP(event) || ''

    // Parse user agent
    const { device, browser, os } = userAgent
      ? parseUserAgent(userAgent)
      : { device: 'Unknown', browser: 'Unknown', os: 'Unknown' }

    // Store click data in analytics using transaction
    await prisma.$transaction([
      // Update link click count and last clicked timestamp
      prisma.links.update({
        where: {
          id: link.id,
        },
        data: {
          clicks: {
            increment: 1,
          },
          lastClicked: new Date(),
        },
      }),
      // Add detailed analytics entry
      prisma.linkAnalytics.create({
        data: {
          linkId: link.id,
          ipAddress: ip,
          referer: referer || null,
          userAgent: userAgent || null,
          device,
          browser,
          os,
          // Note: country, city, region would come from IP geolocation service
          // which would need to be implemented separately
        },
      }),
    ])

    // Add cache control headers
    setResponseHeaders(event, {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    })

    // Use 302 instead of 301 for temporary redirects
    return sendRedirect(event, link.url, 302)
  }
  catch (error) {
    console.error('🚧 Error in slug redirect handler:', error)
    // Continue to normal routing in case of error
    return
  }
})
