<template>
  <div class="w-full text-sm rounded-none border-y  py-4 px-6 shadow-sm dark:border-neutral-800 dark:text-white text-neutral-800 lg:px-12">
    <div class="flex items-center space-x-2 container">
      <span>
        <div>Welcome to Lynq, currently in <Badge variant="destructive" class="mx-1">alpha</Badge>. We're actively improving the platform and would appreciate your feedback. If you encounter any issues,
          <NuxtLink
            to="https://github.com/muneebbug/lynq/issues/new/choose"
            rel="noreferrer"
            target="_blank"
            external
            class="underline decoration-dotted underline-offset-4"
          >please report them
          </NuxtLink> on GitHub.
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Badge } from '@/components/ui/badge'
</script>

<style>

</style>
