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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'

interface CopyLinkProps {
  slug: string
}

const props = defineProps<CopyLinkProps>()
const url = `http://localhost:3000/${props.slug}`
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text)
  toast({
    title: 'Link copied to clipboard.',
    description: url,
  })
}
</script>

<style>

</style>
