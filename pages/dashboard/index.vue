<template>
  <div class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <div
      class="flex items-center w-full"
    >
      <SearchLinks />

      <div class="ml-auto space-x-3">
        <SearchTags
          :tags="tags"
          :tag-selected="searchTag!"
          :tag-name="searchTag"
        />
        <CreateLink :tags="tags">
          <Button>
            <Plus :size="16" />
            <span>Create Link</span>
          </Button>
        </CreateLink>
      </div>
    </div>
    <div
      v-if="filteredLinks && filteredLinks.length > 0"
      class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
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
</template>

<script lang="ts" setup>
import { Plus, Sparkles, PackageOpen } from 'lucide-vue-next'

// import type { Tags } from '@prisma/client'
import { Button } from '@/components/ui/button'
import CreateLink from '@/components/links/CreateLink.vue'
import CardLink from '@/components/links/CardLink.vue'
import SearchLinks from '@/components/links/SearchLinks.vue'
import SearchTags from '@/components/tags/SearchTags.vue'

const route = useRoute()
const searchLink = computed(() => route.query.search as string)
const searchTag = computed(() => route.query.tag as string)
const store = useLinksStore()

await useAsyncData('links', async () => await store.getLinks(), {
  watch: [() => route.query],
})

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
