<template>
  <div class="">
    <LayoutHeader />
    <div class="w-full text-sm rounded-none border-y bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black dark:text-white text-neutral-800">
      <div class="flex items-center space-x-2 container">
        <span>
          <p>Welcome to the Lynq. If you detect any problem or bug, feel free to
            <NuxtLink
              to="https://github.com/muneebbug/lynq/issues/new/choose"
              rel="noreferrer"
              target="_blank"
              external
              class="underline decoration-dotted underline-offset-4"
            >create an issue
            </NuxtLink> on Github.
          </p>
        </span>
      </div>
    </div>
    <main class="mt-20 flex w-full flex-col items-center justify-center space-y-8">
      <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-black" />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">

</script>
