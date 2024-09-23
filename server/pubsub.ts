// pubsub.ts
type Callback = (data: any) => void

const subscribers: Record<string, Callback[]> = {}

// Publish function (called from the tRPC route)
export function publish(event: string, data: any) {
  if (subscribers[event]) {
    subscribers[event].forEach(callback => callback(data))
  }
}

// Subscribe function (called from the SSE route)
export function subscribe(event: string, callback: Callback) {
  if (!subscribers[event]) {
    subscribers[event] = []
  }
  subscribers[event].push(callback)
}
