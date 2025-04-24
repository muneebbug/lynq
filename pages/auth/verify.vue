<template>
  <div class="flex flex-col items-center justify-center">
    <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800 dark:text-neutral-50 w-[400px] max-w-sm duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
      <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
        <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
          Email Verification
        </h3>
      </div>

      <div class="p-6 pt-0 grid gap-4 duration-500 animate-in fade-in-30">
        <div
          v-if="isLoading"
          class="flex flex-col items-center space-y-4 py-4"
        >
          <div class="animate-spin h-8 w-8 rounded-full border-b-2 border-primary" />
          <p>Verifying your email...</p>
        </div>

        <div
          v-else-if="isVerified"
          class="flex flex-col items-center space-y-4 py-4"
        >
          <div class="text-green-500 flex items-center justify-center bg-green-50 dark:bg-green-900/20 h-12 w-12 rounded-full mb-2">
            <Check class="h-6 w-6" />
          </div>
          <p class="text-sm">
            Your email has been verified successfully!
          </p>
          <Button
            to="/auth"
            class="mt-4"
          >
            Continue to Login
          </Button>
        </div>

        <div
          v-else
          class="flex flex-col items-center space-y-4 py-4"
        >
          <div class="text-destructive flex items-center justify-center bg-destructive/10 h-12 w-12 rounded-full mb-2">
            <X class="h-6 w-6" />
          </div>
          <p class="text-sm">
            {{ errorMessage || 'Email verification failed.' }}
          </p>
          <Button
            to="/auth"
            class="mt-4"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Check, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'auth',
})

const isLoading = ref(true)
const isVerified = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const route = useRoute()
    const token = route.query.token as string

    if (!token) {
      errorMessage.value = 'Invalid verification link. Token is missing.'
      isLoading.value = false
      return
    }

    // Verify the token with the API
    const response = await $fetch('/api/auth/verify', {
      method: 'POST',
      body: {
        token,
      },
    })

    if (response.status === 'success') {
      isVerified.value = true
    }
    else {
      errorMessage.value = response.message
    }
  }
  catch (error: unknown) {
    console.error('Verification error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during verification'
  }
  finally {
    isLoading.value = false
  }
})
</script>
