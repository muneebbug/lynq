<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="w-full max-w-lg">
      <DialogHeader>
        <DialogTitle>Delete /{{ props.link.slug }}</DialogTitle>
        <DialogDescription class="text-red-500 dark:text-red-400">
          Access to the link will be permanently removed. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <form
        class="space-y-4"
        @submit="onDelete"
      >
        <FormField
          v-slot="{ componentField }"
          name="slug"
          class="space-y-2"
        >
          <FormItem>
            <FormLabel>
              Type <span className="font-mono">{{ props.link.slug }}</span> to
              confirm:
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
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
            variant="destructive"
            type="submit"
            :loading="loading"
            @click="onDelete"
          >
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type * as z from 'zod'
// import type { Tags } from '@prisma/client'

import type { Links } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  // Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { DeleteLinkSchema } from '@/server/schemas'

configure({
  validateOnBlur: false,
  validateOnInput: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
})
const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const store = storeToRefs(useLinksStore())
const props = defineProps<{
  link: Links
}>()

const { handleSubmit, resetForm } = useForm<z.infer<typeof DeleteLinkSchema>>({
  validationSchema: toTypedSchema(DeleteLinkSchema),
})
const { $trpc } = useNuxtApp()
const onDelete = handleSubmit(async (values) => {
  if (values.slug !== props.link.slug) {
    toast({
      title: 'Slug does not match.',
      description: 'Please type the slug correctly.',
      variant: 'destructive',
    })
    return
  }
  try {
    loading.value = true
    const result = await $trpc.links.deleteLink.mutate(values)
    store.links.value = store.links.value.filter(l => l.slug !== result.slug)
    toast({
      title: 'Link deleted successfully.',
      description: `The link /${values.slug} has been deleted.`,
      duration: 2000,
    })
    resetForm()
    open.value = false
  }
  catch {
    toast({
      title: 'An error occurred while deleting the link.',
      description: 'Please try again later.',
      variant: 'destructive',
    })
    return
  }
  finally {
    loading.value = false
  }
})
</script>
