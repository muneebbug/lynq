<template>
  <div class="flex flex-1 flex-col gap-4 lg:gap-6 lg:p-6">
    <div
      class="flex items-center w-full gap-3"
    >
      <SearchLinks />

      <div class="ml-auto space-x-3 flex">
        <DisplayOptions v-model="displayOptions" />
        <SearchTags
          :tags="tags"
          :tag-selected="searchTag!"
          :tag-name="searchTag"
        />
        <CreateLink :tags="tags">
          <Button>
            <Plus :size="16" />
            <span class="hidden md:inline">Create Link</span>
          </Button>
        </CreateLink>
      </div>
    </div>

    <!-- ! Bug: added dataReady to prevent a hydration mismatch error, it will stay here until I find out how to fix it. -->
    <div
      v-if="!dataReady || loading"
      class="flex-1 flex items-center justify-center min-h-[300px]"
    >
      <Loader2Icon class="h-8 w-8 animate-spin text-primary opacity-70" />
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Card view -->
      <div
        v-if="sortedLinks.length > 0 && displayOptions.displayMode === 'cards'"
        class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <CardLink
          v-for="link in sortedLinks"
          :key="link.id"
          :link-info="link"
          :link-tags="link.tags"
          :tags-info="tags"
        />
      </div>

      <!-- Row view -->
      <div
        v-else-if="sortedLinks.length > 0 && displayOptions.displayMode === 'rows'"
        class="flex flex-col gap-2"
      >
        <RowLink
          v-for="link in sortedLinks"
          :key="link.id"
          :link-info="link"
          :link-tags="link.tags"
          :tags-info="tags"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div class="flex flex-col items-center gap-1 text-center">
          <component
            :is="searchLink ? PackageOpen : Sparkles"
            :size="48"
            :stroke-width="0.5"
          />
          <p v-if="searchLink">
            No links found with <span class="font-mono">{{ searchLink }}</span> slug
          </p>
          <p v-else>
            {{ searchTag ? "No links found with this tag" : "No links found" }}
          </p>
          <CreateLink
            :tags="tags"
            :slug="searchLink"
          >
            <Button
              class="mt-4"
              variant="secondary"
            >
              <Plus :size="16" />
              <span>
                {{ searchLink ? `Create a link with ${searchLink} slug` : "Create a new link" }}
              </span>
            </Button>
          </CreateLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Sparkles, PackageOpen, Loader2Icon } from 'lucide-vue-next'

// import type { Tags } from '@prisma/client'
import { Button } from '@/components/ui/button'
import CreateLink from '@/components/links/CreateLink.vue'
import CardLink from '@/components/links/CardLink.vue'
import RowLink from '@/components/links/RowLink.vue'
import SearchLinks from '@/components/links/SearchLinks.vue'
import SearchTags from '@/components/tags/SearchTags.vue'
import DisplayOptions from '@/components/links/DisplayOptions.vue'

// Set up SEO metadata for the dashboard
useSeo({
  title: 'Dashboard',
  description: 'Manage your shortened links and view analytics in your Lynq dashboard.',
  noIndex: true,
})

const route = useRoute()
const searchLink = computed(() => route.query.search as string)
const searchTag = computed(() => route.query.tag as string)

// Display and sorting options
const displayOptions = ref({
  displayMode: 'cards' as 'cards' | 'rows',
  sortBy: 'created' as 'created' | 'clicks' | 'name',
  sortOrder: 'desc' as 'asc' | 'desc',
})

// Load display preferences from localStorage immediately
if (import.meta.client) {
  const savedOptions = localStorage.getItem('lynq-display-options')
  if (savedOptions) {
    try {
      displayOptions.value = JSON.parse(savedOptions)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (e) {
      console.error('Failed to parse saved display options')
    }
  }
}

// Save display preferences to localStorage when changed
watch(displayOptions, (newVal) => {
  if (import.meta.client) {
    // Briefly show loading state when changing display mode or sort
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 50)

    localStorage.setItem('lynq-display-options', JSON.stringify(newVal))
  }
}, { deep: true })

const store = useLinksStore()
const loading = ref(true)
const dataReady = ref(false)

// Load the data
const { pending } = await useAsyncData('links', async () => {
  try {
    await store.getLinks()
    return true
  }
  catch (error) {
    console.error('Failed to fetch links:', error)
    return false
  }
}, {
  watch: [() => route.query],
})

// Set dataReady and loading state after data loads
watch(pending, (isPending) => {
  if (!isPending) {
    // When not pending anymore, data is ready
    loading.value = false

    // Only on client side, mark data as ready with slight delay
    if (import.meta.client) {
      setTimeout(() => {
        dataReady.value = true
      }, 50)
    }
  }
  else {
    // When pending again (route change), show loading
    loading.value = true
  }
}, { immediate: true })

// For cleaner hydration, set dataReady client-side
onMounted(() => {
  if (!pending.value) {
    setTimeout(() => {
      dataReady.value = true
    }, 50)
  }
})

const links = storeToRefs(store).links
const tags = storeToRefs(store).tags

// Filter and sort links in a single operation for better performance
const sortedLinks = computed(() => {
  // First, filter the links
  const filtered = links.value.filter((link) => {
    if (!searchLink.value && !searchTag.value) return true

    // Filter links by search query
    const matchSlug = !searchLink.value
      || link.slug.toLowerCase().includes(searchLink.value.toLowerCase())
      || link.url.toLowerCase().includes(searchLink.value.toLowerCase())
      || link.description?.toLowerCase().includes(searchLink.value.toLowerCase())

    // Filter links by search tag
    const matchTag
      = !searchTag.value || link.tags.some(tag => tag.tagId === searchTag.value)

    return matchSlug && matchTag
  })

  // Then sort the filtered links
  const sorted = [...filtered]

  switch (displayOptions.value.sortBy) {
    case 'created':
      sorted.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
      break
    case 'clicks':
      sorted.sort((a, b) => a.clicks - b.clicks)
      break
    case 'name':
      sorted.sort((a, b) => a.slug.localeCompare(b.slug))
      break
  }

  // Reverse if descending order
  if (displayOptions.value.sortOrder === 'desc') {
    sorted.reverse()
  }

  return sorted
})

// Watch for route changes and reset display state
watch(() => route.query, () => {
  loading.value = true
}, { deep: true })

definePageMeta({
  layout: 'dashboard',
})
</script>

<style>

</style>
