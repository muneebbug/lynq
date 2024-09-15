<template>
  <section
    id="hero"
    class="flex flex-col items-center px-6 pt-16 text-center md:pt-24 lg:pt-32"
  >
    <h1
      class="mt-6 text-5xl font-bold tracking-tight lg:text-6xl max-w-[75ch] duration-500 animate-in fade-in-5 slide-in-from-bottom-2"
    >
      Links, Reimagined with Lynq
    </h1>
    <p
      class="text-pretty max-w-[75ch] text-sm duration-700 animate-in fade-in-5 slide-in-from-top-2 md:text-base [&:not(:first-child)]:mt-6"
    >
      Lynq makes managing your links simple. It’s an open-source platform that helps you create, organize, and share short links without any hassle.
    </p>
    <div
      class="mt-8 items-center justify-center gap-x-3 space-y-3 duration-700 animate-in fade-in-30 sm:flex sm:space-y-0"
    >
      <Button
        to="/dashboard"
        variant="secondary"
      >
        <Icon
          name="mdi:link-variant"
          size="20"
        />
        <span>
          Create a Link
        </span>
      </Button>
      <Button
        to="https://github.com/muneebbug/lynq"
        variant="outline"
        target="_blank"
        external
      >
        <Icon
          name="simple-icons:github"
          size="20"
          class="mr-2 w-4 h-4"
        />
        <span>
          Star on GitHub
        </span>
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
