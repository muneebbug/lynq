<template>
  <div class="relative min-h-screen">
    <LayoutHeader />
    <HeaderBottomBar />
    <main class="mt-20 flex w-full flex-col items-center justify-center space-y-8">
      <div class="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">

</script>
