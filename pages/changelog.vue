<script setup lang="ts">
import { Clock, GitPullRequest, Tag, CheckCircle2, Bug, Wrench, Package, Palette } from 'lucide-vue-next'
import { changelog } from '@/data/changelog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  layout: 'default',
})

// Set meta information for the page
useHead({
  title: 'Changelog',
  meta: [
    {
      name: 'description',
      content: 'Track all updates and improvements to Lynq, the powerful link management and analytics platform.',
    },
  ],
})

// Helper function to get icon based on change type
const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case 'feat': return GitPullRequest
    case 'fix': return Bug
    case 'refactor': return Wrench
    case 'chore': return Package
    case 'ui': return Palette
    default: return CheckCircle2
  }
}

// Helper function to get badge variant based on change type
const getChangeTypeVariant = (type: string) => {
  switch (type) {
    case 'feat': return 'default'
    case 'fix': return 'destructive'
    case 'refactor': return 'secondary'
    case 'chore': return 'outline'
    case 'ui': return 'default'
    default: return 'secondary'
  }
}

// Helper function to get the full type name
const getChangeTypeName = (type: string) => {
  switch (type) {
    case 'feat': return 'Feature'
    case 'fix': return 'Bug Fix'
    case 'refactor': return 'Refactor'
    case 'chore': return 'Maintenance'
    case 'ui': return 'UI'
    case 'remove': return 'Removed'
    case 'temp': return 'Temporary'
    default: return type
  }
}
</script>

<template>
  <div class="container py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center mb-12 text-center">
      <h1 class="text-4xl font-bold tracking-tight mb-4">
        Changelog
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl">
        Track all the updates and improvements we're making to Lynq. We're constantly working to make your experience better.
      </p>
    </div>

    <div class="space-y-16">
      <div
        v-for="(release, index) in changelog"
        :key="index"
        class="space-y-6"
      >
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <Tag class="h-5 w-5 text-primary" />
              <h2 class="text-2xl font-bold">
                {{ release.title }}
              </h2>
            </div>
            <div class="flex items-center mt-2 text-muted-foreground">
              <Badge
                variant="outline"
                class="mr-2"
              >
                {{ release.version }}
              </Badge>
              <Clock class="h-4 w-4 mr-1" />
              <span class="text-sm">{{ release.date }}</span>
            </div>
          </div>
        </div>

        <p
          v-if="release.description"
          class="text-muted-foreground"
        >
          {{ release.description }}
        </p>

        <div class="space-y-6 pl-4 border-l-2 border-muted">
          <div
            v-for="(change, changeIndex) in release.changes"
            :key="changeIndex"
            class="relative transition-all"
          >
            <!-- Dot indicator -->
            <div class="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary" />

            <div class="mb-2 flex items-center gap-2">
              <component
                :is="getChangeTypeIcon(change.type)"
                class="h-5 w-5"
              />
              <Badge :variant="getChangeTypeVariant(change.type)">
                {{ getChangeTypeName(change.type) }}
              </Badge>
              <span class="font-medium">{{ change.title }}</span>
            </div>

            <p
              v-if="change.description"
              class="text-muted-foreground ml-7"
            >
              {{ change.description }}
            </p>
          </div>
        </div>

        <Separator
          v-if="index < changelog.length - 1"
          class="mt-8"
        />
      </div>
    </div>
  </div>
</template>
