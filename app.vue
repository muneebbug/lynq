<template>
  <NuxtLoadingIndicator
    color="#2563eb"
    :height="3"
  />
  <ClientOnly>
    <Toaster />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>
