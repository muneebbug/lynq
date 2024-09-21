<template>
  <div>
    <LayoutHeader />
    <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-black" />
    <div class="mx-automax-w-screen-xl px-4 py-8 lg:py-16">
      <div class="mx-auto max-w-screen-sm text-center">
        <h1 class="mb-4 font-mono text-6xl font-bold tracking-tight lg:text-7xl">
          {{ status }}
        </h1>
        <p class="mb-4 text-3xl font-medium tracking-tight text-gray-900 dark:text-white md:text-4xl">
          {{ props.error.message }}
        </p>
        <p
          v-if="status === '404'"
          class="mb-4 font-mono text-sm font-light text-gray-500 dark:text-gray-400"
        >
          The page you're looking for doesn't exist on {{ APP_BASE_URL }}
        </p>
        <div class="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            to="/"
            @click="handleError"
          >
            <HomeIcon :size="18" />
            <span>Go back home</span>
          </Button>
          <Button
            external
            target="_blank"
            variant="outline"
            to="https://github.com/muneebbug/lynq/issues/new/choose"
          >
            <span>Create issue</span>
            <ArrowUpRight :size="18" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight, HomeIcon } from 'lucide-vue-next'
import type { NuxtError } from '#app'
import { Button } from '@/components/ui/button'

const props = defineProps<{ error: NuxtError }>()

const status = computed(() => props.error.statusCode?.toString())
const handleError = () => clearError({ redirect: '/' })

const APP_BASE_URL = useRuntimeConfig().public.APP_BASE_URL
</script>
