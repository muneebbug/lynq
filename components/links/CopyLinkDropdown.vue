<template>
  <DropdownMenuItem
    class="space-x-3"
    @click="handleCopy(url)"
  >
    <Clipboard :size="15" />
    <span>Copy to clipboard</span>
  </DropdownMenuItem>
</template>

<script lang="ts" setup>
import { Clipboard } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface CopyLinkProps {
  slug: string
}
const APP_BASE_URL = useRuntimeConfig().public.APP_BASE_URL
const props = defineProps<CopyLinkProps>()
const url = `${APP_BASE_URL}/${props.slug}`
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text)
  toast('Link copied to clipboard.', {
    description: url,
  })
}
</script>

<style>

</style>
