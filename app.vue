<template>
  <NuxtLoadingIndicator
    color="#2563eb"
    :height="3"
  />
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>
