import { prisma } from '@/server/prisma'

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

    // Update click count and last clicked timestamp
    await prisma.links.update({
      where: {
        id: link.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
        lastClicked: new Date(),
      },
    })

    // Perform a server-side redirect
    return sendRedirect(event, link.url, 301)
  }
  catch (error) {
    console.error('🚧 Error in slug redirect handler:', error)
    // Continue to normal routing in case of error
    return
  }
})
