<template>
  <section class="relative overflow-hidden py-10 md:py-16 lg:py-20">
    <div class="absolute inset-0 z-0" />

    <!-- Top pill button -->
    <div class="container relative z-10 flex justify-center mb-4 md:mb-8">
      <div class="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs md:px-4 md:py-1.5 md:text-sm backdrop-blur-sm transition-colors">
        <span class="mr-1">Introducing Analytics Dashboard</span>
        <ChevronRight class="h-3 w-3 md:h-4 md:w-4" />
      </div>
    </div>

    <!-- Main content -->
    <div class="container relative z-10">
      <div class="flex flex-col items-center space-y-6 md:space-y-10 text-center">
        <!-- Headline -->
        <div class="max-w-3xl space-y-3 md:space-y-4 px-2">
          <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Short links with <br>superpowers
          </h1>
          <p class="mx-auto max-w-[700px] text-sm text-muted-foreground sm:text-base md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Create, track, and manage your short links with powerful analytics.
            Organize with tags and share with anyone.
          </p>
        </div>

        <!-- Buttons -->
        <div
          class="mt-2 flex flex-col w-full items-center justify-center gap-2 duration-700 animate-in fade-in-30 sm:flex-row sm:gap-3 px-4 sm:px-0"
        >
          <Button
            to="/dashboard"
            variant="secondary"
            class="w-full sm:w-auto"
          >
            <Icon
              name="mdi:link-variant"
              size="18"
              class="mr-1 md:mr-2"
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
            class="w-full sm:w-auto"
          >
            <Icon
              name="simple-icons:github"
              size="18"
              class="mr-1 md:mr-2 w-4 h-4"
            />
            <span>
              Star on GitHub
            </span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Image section -->
    <div class="container relative z-10 mt-8 md:mt-16 lg:mt-24 px-4 md:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg border border-b-0 bg-background shadow-xl relative max-w-7xl mx-auto">
        <img
          src="/images/dashboard.png"
          alt="Lynq Dashboard"
          class="w-full h-auto relative z-10"
        >
        <div class="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>
