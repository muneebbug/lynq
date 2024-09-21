<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="w-full max-w-lg">
      <DialogHeader>
        <DialogTitle>Edit Link</DialogTitle>
        <DialogDescription>
          /{{ props?.link?.slug }}
        </DialogDescription>
      </DialogHeader>
      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <FormField
          v-slot="{ componentField }"
          name="url"
          class="space-y-2"
        >
          <FormItem>
            <FormLabel>Destination URL:</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="https://google.com"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="slug"
          class="space-y-2"
        >
          <FormItem>
            <FormLabel>Short link:</FormLabel>
            <FormControl>
              <div class="relative flex w-full items-center">
                <Input
                  type="text"
                  placeholder="shortlink"
                  v-bind="componentField"
                  class="rounded-none rounded-bl-md rounded-tl-md"
                  :disabled="unlockSlug"
                />
                <Popover v-if="unlockSlug">
                  <PopoverTrigger class="absolute bottom-0 right-0 top-0 flex items-center px-3">
                    <Lock :size="16" />
                  </PopoverTrigger>
                  <PopoverContent class="max-w-72 text-sm">
                    <p class="mb-2">
                      Editing the custom link will remove access from
                      the previous link and it will be available to
                      everyone. Are you sure you want to continue?
                    </p>
                    <Button
                      variant="outline"
                      class="w-full"
                      @click="unlockSlug = false"
                    >
                      <LockOpen :size="16" />
                      <span>Unlock</span>
                    </Button>
                  </PopoverContent>
                </Popover>
                <Button
                  v-else
                  type="button"
                  variant="ghost"
                  class="absolute bottom-0 right-0 top-0 flex items-center px-3"
                  @click="unlockSlug = true"
                >
                  <LockOpen :size="16" />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="description"
          class="space-y-2"
        >
          <FormItem>
            <FormLabel>Description (optional):</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter a description"
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
              Close
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="dialogForm"
            :loading="loading"
            @click="onSubmit"
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type * as z from 'zod'
import { LockOpen, Lock } from 'lucide-vue-next'

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { toast, ToastAction } from '@/components/ui/toast'
import { EditLinkSchema } from '@/server/schemas'

configure({
  validateOnBlur: false,
  validateOnModelUpdate: true,
})
const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<boolean>(false)
const message = ref<string>('')
const unlockSlug = ref<boolean>(true)

const props = defineProps<{
  link?: Links
  // tags: Tags[]
}>()

const APP_BASE_URL = useRuntimeConfig().public.APP_BASE_URL
const store = storeToRefs(useLinksStore())

const { handleSubmit, resetForm, setValues } = useForm<z.infer<typeof EditLinkSchema>>({
  validationSchema: toTypedSchema(EditLinkSchema),
  initialValues: {
    id: props.link?.id ?? '',
    url: props.link?.url ?? '',
    slug: props.link?.slug ?? '',
    description: props.link?.description ?? '',
  },
})

watch(open, () => {
  if (open.value) {
    unlockSlug.value = true
    setValues({
      id: props.link?.id ?? '',
      url: props.link?.url ?? '',
      slug: props.link?.slug ?? '',
      description: props.link?.description ?? '',
    })
  }
})
const { $trpc } = useNuxtApp()
const onSubmit = handleSubmit(async (values) => {
  if (values.slug === values.url) {
    loading.value = false
    error.value = true
    message.value = 'Slug cannot be the same as the destination URL.'
    return
  }
  try {
    loading.value = true
    if (values.slug === values.url) {
      toast({
        title: 'The slug you\'ve entered already exists.',
        description: 'Please choose a different slug.',
        variant: 'destructive',
      })

      return
    }
    const result = await $trpc.links.updateLink.mutate(values)
    store.links.value = store.links.value.map(l => l.id === result.id ? result : l)

    toast({
      title: 'Link updated successfully.',
      description: `${APP_BASE_URL}/${result.slug}`,
      action: h(ToastAction, {
        altText: 'Copy',
        as: 'button',
        onClick: () => {
          navigator.clipboard.writeText(`${APP_BASE_URL}/${result.slug}`)
        },
      }, {
        default: () => 'Copy',
      }),
      duration: 5000,
    })

    resetForm()
    open.value = false
  }
  catch {
    error.value = true
    loading.value = false
    return
  }
  finally {
    loading.value = false
  }
  // toast({
  //   title: 'You submitted the following values:',
  //   description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  // })
})
</script>
