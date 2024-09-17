<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create new tag</DialogTitle>
        <DialogDescription>
          Create a new tag to organize your links.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            type="button"
            variant="link"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          :loading="loading"
          variant="destructive"
          @click="handleDeleteTag"
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script  lang="ts" setup>
import type { Tags } from '@prisma/client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

interface DeleteTagProps {
  tag: Tags
}
const props = defineProps<DeleteTagProps>()

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const store = storeToRefs(useLinksStore())
const handleDeleteTag = async () => {
  try {
    loading.value = true
    const { $trpc } = useNuxtApp()
    const result = await $trpc.tags.removeTag.mutate({
      tagId: props.tag.id,
    })
    store.tags.value = store.tags.value.filter(t => t.id !== result.id)
    open.value = false
    toast({
      title: 'Tag deleted successfully.',
      variant: 'destructive',
      duration: 3000,
    })
  }
  catch {
    toast({
      title: 'An error occurred while deleting the tag.',
      variant: 'destructive',
      duration: 3000,
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<style>

</style>
