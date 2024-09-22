<template>
  <div class="flex w-full flex-col p-4 rounded-lg border border-dashed shadow-sm">
    <div class="mb-6 flex flex-col space-y-1 rounded-md">
      <div class="flex items-center space-x-2">
        <h4 class="my-0 text-2xl font-semibold tracking-tight lg:text-3xl">
          {{ props.title }}
        </h4>
      </div>
      <p class="text-sm opacity-70">
        {{ props.description }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface SettingsCardProps {
  title: string
  description: string
}
const props = defineProps<SettingsCardProps>()
</script>

<style>

</style>
