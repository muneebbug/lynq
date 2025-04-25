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
          <FormDescription
            v-if="user.isOAuth"
            class="flex items-center gap-2 pl-1 text-neutral-500 dark:text-neutral-400"
          >
            <AlertTriangle :size="14" />
            <span>Email address is managed by your OAuth provider.</span>
          </FormDescription>
          <FormDescription
            v-else-if="pendingEmailChange"
            class="flex items-center gap-2 pl-1 text-neutral-500 dark:text-neutral-400"
          >
            <Clock :size="14" />
            <span>
              Verification pending for new email: <span class="font-semibold">{{ pendingEmailChange.newEmail }}</span>.
              <Button
                variant="link"
                class="h-auto p-0 text-xs underline"
                @click="resendVerification"
              >
                Resend verification
              </Button>
            </span>
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
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { AlertTriangle, Save, Clock } from 'lucide-vue-next'
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

import { UpdateProfileSchema } from '~/server/schemas'
import type { ExtendedUser } from '~/types'

interface GeneralSettingsProps {
  user: ExtendedUser
}

const props = defineProps<GeneralSettingsProps>()

const { $trpc } = useNuxtApp()
const loading = ref<boolean>(false)
const pendingEmailChange = ref<{ newEmail: string, expires: Date } | null>(null)

// Check for pending email changes
async function checkPendingEmailChange() {
  try {
    const result = await $trpc.user.getPendingEmailChange.query()
    pendingEmailChange.value = result
  }
  catch (error) {
    console.error('Failed to fetch pending email change:', error)
  }
}

// Initial check on component mount
onMounted(async () => {
  await checkPendingEmailChange()
})

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

// Function to resend verification email
async function resendVerification() {
  try {
    loading.value = true
    if (pendingEmailChange.value) {
      await $trpc.user.requestEmailChange.mutate({
        newEmail: pendingEmailChange.value.newEmail,
      })
      toast.success('Verification email resent.')
    }
  }
  catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Failed to resend verification email')
  }
  finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (submittedValues) => {
  try {
    loading.value = true

    // Handle email separately based on different scenarios
    if (!props.user.isOAuth && submittedValues.email) {
      // Case 1: Email is being changed to something new
      if (submittedValues.email !== props.user.email) {
        // Request email change with verification
        await $trpc.user.requestEmailChange.mutate({
          newEmail: submittedValues.email,
        })

        toast.success('Verification email sent to your new address.')

        // Update other fields but not email
        await $trpc.user.updateProfile.mutate({
          name: submittedValues.name,
          username: submittedValues.username,
        })

        await useAuth().refresh()

        // Update form initial values except email (keep showing current email)
        initialValues.value = {
          ...submittedValues,
          email: props.user.email!,
        }
      }
      // Case 2: Email is the same as current (potentially cancelling pending change)
      else {
        // If there's a pending email change, this will cancel it on the server
        await $trpc.user.requestEmailChange.mutate({
          newEmail: props.user.email!,
        })

        // Regular update with all fields
        await $trpc.user.updateProfile.mutate({
          name: submittedValues.name,
          username: submittedValues.username,
          email: submittedValues.email,
        })

        await useAuth().refresh()
        initialValues.value = { ...submittedValues }
        toast.success('Profile updated successfully.')
      }

      // Always refresh pending email change status
      await checkPendingEmailChange()
    }
    // Case 3: OAuth user or no email change
    else {
      // Regular update (no email change)
      await $trpc.user.updateProfile.mutate({
        ...submittedValues,
        email: props.user.isOAuth ? undefined : submittedValues.email,
      })

      await useAuth().refresh()
      initialValues.value = { ...submittedValues }
      toast.success('Profile updated successfully.')
    }

    isChanged.value = false
  }
  catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'An error occurred while updating your profile.')
  }
  finally {
    loading.value = false
  }
})
</script>

<style>

</style>
