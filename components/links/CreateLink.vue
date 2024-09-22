<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="w-full max-w-lg">
      <DialogHeader>
        <DialogTitle>Create new link</DialogTitle>
        <DialogDescription>
          Create a new link to share with your friends.
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
              <div class="flex w-full items-center">
                <Input
                  type="text"
                  placeholder="shortlink"
                  v-bind="componentField"
                  class="rounded-none rounded-bl-md rounded-tl-md"
                />
                <Button
                  variant="outline"
                  size="lg"
                  class="rounded-none rounded-br-md rounded-tr-md h-12"
                  @click="handleGenerateRandomSlug"
                >
                  <Shuffle :size="14" />
                  <span>Randomize</span>
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
              variant="secondary"
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
            Create
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
import { Shuffle } from 'lucide-vue-next'

import type { Tags } from '@prisma/client'
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
import { toast, ToastAction } from '@/components/ui/toast'
import { CreateLinkSchema } from '@/server/schemas'

configure({
  validateOnBlur: false,
  validateOnModelUpdate: true,
})
const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<boolean>(false)
const message = ref<string>('')

const APP_BASE_URL = useRuntimeConfig().public.APP_BASE_URL

const props = defineProps<{
  slug?: string
  tags: Tags[]
}>()

const store = storeToRefs(useLinksStore())

const { handleSubmit, setFieldValue, resetForm, setValues } = useForm<z.infer<typeof CreateLinkSchema>>({
  validationSchema: toTypedSchema(CreateLinkSchema),
  initialValues: {
    slug: props.slug ?? '',
  },
})
watch(open, () => {
  if (open.value) {
    setValues({
      slug: props.slug ?? '',
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
    const slugExists = await $trpc.links.checkIfSlugExist.query(values.slug)
    if (slugExists) {
      toast({
        title: 'The slug you\'ve entered already exists.',
        description: 'Please choose a different slug.',
        variant: 'destructive',
      })

      return
    }
    const result = await $trpc.links.createLink.mutate(values)
    store.links.value.unshift(toRef(result).value)

    toast({
      title: 'Link created successfully.',
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

const handleGenerateRandomSlug = (e: MouseEvent) => {
  e.preventDefault()
  const randomSlug = Math.random().toString(36).substring(7)
  setFieldValue('slug', randomSlug)
}
</script>
