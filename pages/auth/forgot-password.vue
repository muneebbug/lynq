<template>
  <div class="flex flex-col items-center justify-center">
    <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800 dark:text-neutral-50 w-full max-w-sm duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
      <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
        <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
          Forgot Password
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 duration-500 animate-in fade-in-30">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <div class="p-6 pt-0 grid gap-4 duration-500 animate-in fade-in-30">
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="name@example.com"
              required
            />
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
            Send Reset Link
          </Button>
        </form>

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
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'auth',
})

const email = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value) {
    error.value = 'Email is required'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/user/reset-password', {
      method: 'POST',
      body: {
        email: email.value,
      },
    })

    if (response.status === 'success') {
      toast.success(response.message)
      email.value = ''
    }
    else {
      error.value = response.message
    }
  }
  catch (e: unknown) {
    console.error('Password reset request error:', e)
    error.value = e instanceof Error ? e.message : 'An error occurred'
  }
  finally {
    isLoading.value = false
  }
}
</script>
