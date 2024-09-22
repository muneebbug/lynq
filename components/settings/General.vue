<template>
  <SettingsCard
    title="General"
    description="Update your personal information:"
  >
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
          <FormLabel>Name:</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="John Doe"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="email"
        class="space-y-2"
      >
        <FormItem>
          <FormLabel>Email:</FormLabel>
          <FormControl>
            <Input
              :disabled="user.isOAuth"
              type="email"
              placeholder="johndoe@gmail.com"
              v-bind="componentField"
            />
          </FormControl>
          <FormDescription class="flex items-center gap-2 pl-1 text-neutral-500 dark:text-neutral-400">
            <AlertTriangle :size="14" />
            <span>Email address is managed by your OAuth provider.</span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        :disabled="!isChanged"
        type="submit"
        :loading="loading"
        variant="secondary"
      >
        <Save :size="16" />
        <span>Save</span>
      </Button>
    </form>
  </SettingsCard>
</template>

<script lang="ts" setup>
import type * as z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { AlertTriangle, Save } from 'lucide-vue-next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { UpdateProfileSchema } from '~/server/schemas'
import type { ExtendedUser } from '~/types'

interface GeneralSettingsProps {
  user: ExtendedUser
}

const props = defineProps<GeneralSettingsProps>()

const initialValues = ref<z.infer<typeof UpdateProfileSchema>>({
  name: props.user.name!,
  username: props.user.username,
  email: props.user.email!,
})

const { handleSubmit, values } = useForm<z.infer<typeof UpdateProfileSchema>>({
  validationSchema: toTypedSchema(UpdateProfileSchema),
  initialValues: initialValues.value,
})
const isChanged = ref<boolean>(false)

watch(values, () => {
  isChanged.value = JSON.stringify(values) !== JSON.stringify(initialValues)
})

const loading = ref<boolean>(false)
const { $trpc } = useNuxtApp()
const onSubmit = handleSubmit(async (submittedValues) => {
  try {
    loading.value = true
    await $trpc.user.updateProfile.mutate({
      ...submittedValues,
      email: props.user.isOAuth ? undefined : submittedValues.email,
    })

    await useAuth().refresh()
    initialValues.value = { ...submittedValues }
    isChanged.value = false
    toast({
      title: 'Profile updated successfully.',
    })
  }
  catch {
    toast({
      title: 'An error occurred while updating your profile.',
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
