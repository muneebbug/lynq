<template>
  <div>
    <p>Link Clicks: {{ clickCount }}</p>

    <button @click="run" >
      Click me
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { $trpc } = useNuxtApp()
const run = async () => {
  await $trpc.links.clickedLink.query()
}
const clickCount = ref(0)

let eventSource

onMounted(() => {
  // Open an SSE connection to the API
  eventSource = new EventSource('/api/sse')

  // Listen for click count updates
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    clickCount.value = data.clicks
  }

  eventSource.onerror = () => {
    console.error('Error in SSE connection')
  }
})

onUnmounted(() => {
  // Close the SSE connection when the component is destroyed
  if (eventSource) {
    eventSource.close()
  }
})
</script>
