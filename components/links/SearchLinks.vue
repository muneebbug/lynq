<template>
  <div class="relative md:grow-0">
    <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      type="search"
      placeholder="Search links"
      class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      :default-value="query"
      @change="onSearch($event)"
      @input="onSearch($event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

// const { search } = useRoute().params
const params = useUrlSearchParams('history')
const router = useRouter()

// check if search params is an array
const query = computed(() => {
  const searchParam = params.search
  if (Array.isArray(searchParam)) {
    return searchParam[0] || ''
  }
  return searchParam || ''
})

const onSearch = useDebounceFn((e: Event) => {
  if (e.target instanceof HTMLInputElement && e.target.value) {
    params.search = e.target.value
  }
  else {
    // delete search from url
    delete params.search
  }
  router.push({ query: params })
}, 500)
</script>

<style>

</style>
