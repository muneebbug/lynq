<template>
  <SettingsCard
    title="Danger Zone"
    description="Permanently delete your account and all of your data. Once you delete your account, there is no going back. This action cannot be undone."
  >
    <div class="space-y-4">
      <div class="space-y-4">
        <Button
          variant="destructive"
          @click="showDeleteDialog = true"
        >
          Delete Account
        </Button>
      </div>
    </div>

    <!-- Delete Account Dialog -->
    <Dialog
      :open="showDeleteDialog"
      @update:open="showDeleteDialog = $event"
    >
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? All of your data will be permanently removed.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form
          class="space-y-4"
          @submit.prevent="handleDelete"
        >
          <div
            v-if="hasPassword"
            class="space-y-2"
          >
            <Label for="password">Confirm your password:</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div
            v-if="error"
            class="text-sm text-destructive"
          >
            {{ error }}
          </div>

          <div class="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              @click="showDeleteDialog = false"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              :loading="loading"
            >
              Delete Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </SettingsCard>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

defineOptions({
  name: 'SettingsDangerZone',
})

const { $trpc } = useNuxtApp()
const { signOut } = useAuth()
const loading = ref<boolean>(false)
const error = ref<string>('')
const password = ref<string>('')
const showDeleteDialog = ref<boolean>(false)

const hasPassword = ref(false)

const { data: passwordStatus, refresh: refreshPasswordStatus } = await useAsyncData(
  'hasPasswordForDelete',
  () => $trpc.user.hasPassword.query(),
)

hasPassword.value = passwordStatus.value?.hasPassword ?? false

// Watch dialog state and refresh password status when opened
watch(showDeleteDialog, async (newValue) => {
  if (newValue) {
    // Dialog opened, refresh password status
    await refreshPasswordStatus()
    hasPassword.value = passwordStatus.value?.hasPassword ?? false
    // Reset fields
    password.value = ''
    error.value = ''
  }
})

async function handleDelete() {
  try {
    error.value = ''
    loading.value = true

    await $trpc.user.deleteAccount.mutate({
      password: hasPassword.value ? password.value : undefined,
    })

    toast.success('Your account has been deleted')

    // Sign out and redirect to auth page
    setTimeout(async () => {
      await signOut({ callbackUrl: '/auth' })
    }, 1000)
  }
  catch (err: unknown) {
    error.value = (err as Error)?.message || 'Failed to delete account'
    loading.value = false
  }
}
</script>
