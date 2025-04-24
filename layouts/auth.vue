<template>
  <div class="relative min-h-screen">
    <LayoutHeader />
    <HeaderBottomBar />
    <main class="mt-20 flex w-full flex-col items-center justify-center space-y-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
</script>
