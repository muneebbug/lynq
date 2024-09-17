<template>
  <Popover
    v-model:open="open"
  >
    <PopoverTrigger as-child>
      <Button variant="outline">
        <XIcon
          v-if="open"
          :size="16"
        />
        <TagsIcon
          v-else
          :size="16"
        />
        <span v-if="props.tagName">
          <template
            v-for="(tag, index) in props.tags"
            :key="index"
          >
            <template v-if="tag.id === props.tagName">
              {{ tag.name }}
            </template>
          </template>
        </span>
        <span
          v-else
          class="hidden md:block"
        >Select a tag</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <p class="my-2 text-center text-sm font-medium">
        My Tags ({{ props.tags.length }})
      </p>
      <div class="mb-2 flex w-full flex-col space-y-1">
        <div
          v-if="props.tags.length === 0"
          class="my-4 flex flex-col items-center justify-center space-y-2 text-sm text-neutral-500 dark:text-neutral-400"
        >
          <TagIcon
            :size="24"
            :stroke-width="1.5"
          />
          <span>No tags found</span>
        </div>
        <div
          v-for="tag in props.tags"
          :key="tag.id"
          aria-label="{tag.name}"
          class="flex w-full items-center justify-between rounded-md border border-neutral-200 px-2 py-1 text-left text-sm transition-colors duration-200 hover:opacity-80 dark:border-neutral-800"
          style=""
        >
          <button
            class="w-full text-start"
            @click="() => handleSearchTag(tag.id)"
          >
            {{ tag.name }}
          </button>
          <div class="flex items-center space-x-2">
            <CheckIcon
              v-if="tag.id === props.tagSelected"
              :size="16"
            />
            <DeleteTag
              :tag="tag"
            >
              <button class="rounded-md p-1 hover:opacity-80">
                <XIcon :size="16" />
              </button>
            </DeleteTag>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <Button
            variant="outline"
            @click="handleClearSearch"
          >
            <SearchXIcon :size="16" />
            <span>Clear search</span>
          </Button>
          <CreateTag :tags-created="props.tags">
            <Button
              variant="outline"
              class-name="w-full"
            >
              <PlusIcon :size="16" />
              <span>Create Tag</span>
            </Button>
          </CreateTag>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { Tags } from '@prisma/client'

import { CheckIcon, PlusIcon, TagIcon, XIcon, SearchXIcon, TagsIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CreateTag from '@/components/tags/CreateTag.vue'
import DeleteTag from '@/components/tags/DeleteTag.vue'
// Props
interface SearchTagProps {
  tags: Tags[]
  tagSelected?: string
  tagName?: string
}

const props = defineProps<SearchTagProps>()

// State for popover open/close
const open = ref(false)

// Vue Router
// const route = useRoute()
const router = useRouter()

const handleSearchTag = (value: string) => {
  const params = useUrlSearchParams('history')
  params.tag = value
  router.push({ query: params })
}
const handleClearSearch = () => {
  const params = useUrlSearchParams('history')
  delete params.tag
  router.push({ query: params })
}
</script>
