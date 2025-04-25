<template>
  <SettingsCard
    title="Password"
    :description="
      hasPassword
        ? 'Change your account password:'
        : 'Set a password for your account:'
    "
  >
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <template v-if="hasPassword">
        <FormField
          v-slot="{ componentField }"
          name="currentPassword"
          class="space-y-2"
        >
          <FormItem>
            <FormLabel>Current Password:</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Your current password"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </template>

      <FormField
        v-slot="{ componentField }"
        name="newPassword"
        class="space-y-2"
      >
        <FormItem>
          <FormLabel>New Password:</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="Your new password"
              v-bind="componentField"
            />
          </FormControl>
          <FormDescription class="text-xs text-neutral-500 dark:text-neutral-400">
            Password must be at least 8 characters with lowercase, uppercase letters and a number.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        :loading="loading"
        variant="secondary"
      >
        <Save :size="16" />
        <span>{{ hasPassword ? 'Change Password' : 'Set Password' }}</span>
      </Button>
    </form>
  </SettingsCard>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { Save } from 'lucide-vue-next'
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

import { ChangePasswordSchema, SetupPasswordSchema } from '~/server/schemas'

defineOptions({
  name: 'SettingsPassword',
})

const { $trpc } = useNuxtApp()
const loading = ref<boolean>(false)

// First check if user has a password already set
const { data: passwordStatus, refresh: refreshPasswordStatus } = await useAsyncData(
  'hasPassword',
  () => $trpc.user.hasPassword.query(),
)

const hasPassword = computed(() => passwordStatus.value?.hasPassword ?? false)

// Use different validation schemas based on whether the user has a password or not
const validationSchema = computed(() => {
  return hasPassword.value ? toTypedSchema(ChangePasswordSchema) : toTypedSchema(SetupPasswordSchema)
})

const initialValues = computed(() => {
  return hasPassword.value
    ? { currentPassword: '', newPassword: '' }
    : { newPassword: '' }
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema.value,
  initialValues: initialValues.value,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true

    if (hasPassword.value) {
      // Use change password mutation
      await $trpc.user.changePassword.mutate({
        currentPassword: (values as { currentPassword: string, newPassword: string }).currentPassword,
        newPassword: values.newPassword,
      })
      toast('Password changed successfully.')
    }
    else {
      // Use setup password mutation
      await $trpc.user.setupPassword.mutate({
        newPassword: values.newPassword,
      })
      toast('Password set successfully.')
      await refreshPasswordStatus()
    }

    resetForm()
  }
  catch (error: Error | unknown) {
    toast((error as Error)?.message || 'Failed to update password', {
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
