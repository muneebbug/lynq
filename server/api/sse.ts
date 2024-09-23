// api/sse.ts (Nuxt API route for SSE)
import { subscribe } from '~/server/pubsub'

export default defineEventHandler((event) => {
  const { req, res } = event.node

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Initial message to confirm connection
  res.write('data: {"message": "SSE connection established"}\n\n')

  // Subscribe to the "linkClicked" event
  subscribe('linkClicked', (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  })

  // Cleanup when the connection is closed
  req.on('close', () => {
    console.log('Client disconnected')
  })
})
