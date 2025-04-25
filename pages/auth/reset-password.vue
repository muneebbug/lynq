<template>
  <div class="flex flex-col items-center justify-center">
    <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800 dark:text-neutral-50 w-[400px] max-w-sm duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
      <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
        <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
          Reset Password
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 duration-500 animate-in fade-in-30">
          Enter your new password below
        </p>
      </div>

      <div class="p-6 pt-0 grid gap-4 duration-500 animate-in fade-in-30">
        <form
          v-if="token"
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div class="space-y-2">
            <Label for="password">New Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
            />
            <p class="text-xs text-muted-foreground">
              Password must be at least 8 characters and include uppercase, lowercase, and numbers
            </p>
          </div>

          <div
            v-if="error"
            class="text-sm text-destructive"
          >
            {{ error }}
          </div>

          <Button
            type="submit"
            class="w-full"
            :loading="isLoading"
          >
            Reset Password
          </Button>
        </form>

        <div
          v-else
          class="text-center"
        >
          <p class="text-sm text-destructive mb-4">
            Invalid or expired reset link. Please request a new password reset.
          </p>
          <Button to="/auth/forgot-password">
            Request New Link
          </Button>
        </div>

        <div class="flex items-center justify-center mt-4">
          <NuxtLink
            to="/auth"
            class="text-sm text-primary hover:underline"
          >
            Back to login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'auth',
})

const token = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')

onMounted(() => {
  // Get token from URL query parameter
  const route = useRoute()
  token.value = route.query.token as string || ''
})

async function handleSubmit() {
  error.value = ''

  // Validate passwords
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }

  // Check password strength
  const hasLowercase = /[a-z]/.test(password.value)
  const hasUppercase = /[A-Z]/.test(password.value)
  const hasNumber = /[0-9]/.test(password.value)

  if (!hasLowercase || !hasUppercase || !hasNumber) {
    error.value = 'Password must include uppercase, lowercase, and numbers'
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/user/new-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: password.value,
      },
    })

    if (response.status === 'success') {
      toast.success(response.message)
      // Redirect to login page
      setTimeout(() => {
        navigateTo('/auth')
      }, 2000)
    }
    else {
      error.value = response.message
    }
  }
  catch (e: unknown) {
    console.error('Password reset error:', e)
    error.value = e instanceof Error ? e.message : 'An error occurred'
  }
  finally {
    isLoading.value = false
  }
}
</script>
