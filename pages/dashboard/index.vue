<template>
  <div class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <div
      class="flex items-center w-full"
    >
      <div class="relative md:grow-0">
        <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search links"
          class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      <CreateLink>
        <Button
          class="ml-auto"
        >
          <Plus :size="16" />
          <span>Create Link</span>
        </Button>
      </CreateLink>
    </div>
    <div
      v-if="links && links.length > 0"
      class="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2"
    >
      <CardLink
        v-for="link in filteredLinks"
        :key="link.id"
        :link-info="link"
        :link-tags="link.tags"
        :tags-info="tags"
      />
    </div>
    <div
      v-else
      class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
    >
      <div class="flex flex-col items-center gap-1 text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          You have no links
        </h3>
        <p class="text-sm text-muted-foreground">
          You can start sharing as soon as you add a link.
        </p>
        <CreateLink>
          <Button
            class="mt-4"
            variant="secondary"
          >
            <Plus :size="16" />
            <span>
              Create a new link
            </span>
          </Button>
        </CreateLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search, Plus } from 'lucide-vue-next'

// import type { Tags } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CreateLink from '@/components/links/CreateLink.vue'
import CardLink from '@/components/links/CardLink.vue'

const searchLink = ref<string>('')
const searchTag = ref<string>('')
const store = useLinksStore()

await useAsyncData('links', async () => await store.getLinks())

const links = storeToRefs(store).links
const tags = storeToRefs(store).tags

const filteredLinks = computed(() => {
  return links.value.filter((link) => {
    if (!searchLink.value && !searchTag.value) return true

    // Filter links by search slug
    const matchSlug = !searchLink.value || link.slug.includes(searchLink.value)

    // Filter links by search tag
    const matchTag
      = !searchTag.value || link.tags.some(tag => tag.tagId === searchTag.value)

    return matchSlug && matchTag
  })
})

definePageMeta({
  layout: 'dashboard',
})
</script>

<style>

</style>
