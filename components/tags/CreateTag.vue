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
      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <FormField
          v-slot="{ componentField }"
          name="name"
          class="space-y-2"
        >
          <FormItem>
            <FormLabel>Tag name:</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="instagram"
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
            type="submit"
            variant="secondary"
            :loading="loading"
          >
            <Rocket :size="16" />
            <span>
              Create Tag
            </span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type * as z from 'zod'
import type { Tags } from '@prisma/client'
import { Rocket } from 'lucide-vue-next'
import { CreateTagSchema } from '@/server/schemas'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface CreateTagProps {
  tagsCreated: Tags[]
}
const props = defineProps<CreateTagProps>()

const loading = ref<boolean>(false)
const open = ref<boolean>(false)
// const message = ref<string>()
// const isError = ref<boolean>(false)

const { handleSubmit, setValues, resetForm } = useForm<z.infer<typeof CreateTagSchema>>({
  validationSchema: toTypedSchema(CreateTagSchema),
  initialValues: {
    name: '',
    color: '#171717',
  },
})

watch(open, () => {
  if (open.value) {
    setValues({
      name: '',
      color: '#171717',
    })
  }
})

const onSubmit = handleSubmit(async (values) => {
  console.log('Form submitted!', values)
  try {
    loading.value = true
    if (props.tagsCreated.map(tag => tag.name).includes(values.name)) {
      toast({
        title: 'Tag already exists.',
        description: 'Please choose a different tag name.',
        variant: 'destructive',
      })
      return
    }
    const { $trpc } = useNuxtApp()
    const store = useLinksStore()

    const result = await $trpc.tags.createTag.mutate(values)
    store.tags.push(toRef(result).value)

    if (!result) {
      toast({
        title: 'An error occurred while creating the tag.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }
    toast({
      title: 'Tag created successfully.',
      duration: 3000,
    })
    resetForm()
    open.value = false
  }
  catch {
    toast({
      title: 'An error occurred while creating the tag.',
      variant: 'destructive',
      duration: 3000,
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<style>

</style>
