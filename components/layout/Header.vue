<template>
  <header>
    <nav class="flex w-full pb-3 pt-4 px-4 lg:px-6 sticky top-0 z-50 bg-white dark:bg-black">
      <div class="flex w-full items-center justify-between container">
        <div class="flex items-center space-x-5">
          <div class="flex items-center space-x-1 pr-1 md:pr-4">
            <NuxtLink
              class="flex items-center space-x-3 transition-opacity hover:opacity-80 rtl:space-x-reverse"
              href="/"
            >
              <Icon
                name="mdi:link-variant"
                size="18"
                class="md:size-20"
              />
              <span class="self-center whitespace-nowrap text-base md:text-lg font-medium tracking-tight dark:text-white">lynq</span>
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <Button
            v-if="status === 'unauthenticated'"
            to="/dashboard"
            variant="outline"
            class="group text-sm md:text-base py-1.5 md:py-2"
          >
            <span>Get Started</span>
            <Icon
              name="mdi:login"
              size="16"
              class="ml-1.5 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4 transform transition-transform group-hover:translate-x-[2px]"
            />
          </Button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'

const { status } = useAuth()
</script>

<style></style>
