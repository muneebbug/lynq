<template>
  <div class="flex flex-col items-center justify-center">
    <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800 dark:text-neutral-50 w-[400px] max-w-sm duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
      <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
        <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
          Verifying Email Change
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 duration-500 animate-in fade-in-30">
          Please wait while we verify your email change request...
        </p>
      </div>

      <div class="p-6 pt-0 grid gap-4 duration-500 animate-in fade-in-30">
        <div
          v-if="verificationStatus === 'loading'"
          class="flex flex-col items-center justify-center py-4"
        >
          <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p class="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Verifying your new email address
          </p>
        </div>

        <div
          v-else-if="verificationStatus === 'success'"
          class="flex flex-col items-center justify-center py-4"
        >
          <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900 dark:text-green-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p class="mt-4 text-sm font-medium">
            {{ message }}
          </p>
          <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            You can now log in with your new email address.
          </p>
        </div>

        <div
          v-else-if="verificationStatus === 'error'"
          class="flex flex-col items-center justify-center py-4"
        >
          <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-900 dark:text-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            /><line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            /></svg>
          </div>
          <p class="mt-4 text-sm font-medium text-destructive">
            {{ message }}
          </p>
          <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Please try requesting another email change.
          </p>
        </div>

        <div class="flex items-center justify-center mt-4">
          <NuxtLink
            to="/dashboard/settings"
            class="text-sm text-primary hover:underline"
          >
            Back to settings
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const { $trpc } = useNuxtApp()
const route = useRoute()

definePageMeta({
  layout: 'auth',
})

useSeo({
  title: 'Verify Email Change',
  description: 'Verify your email change request',
})

type VerificationStatus = 'loading' | 'success' | 'error'
const verificationStatus = ref<VerificationStatus>('loading')
const message = ref<string>('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    verificationStatus.value = 'error'
    message.value = 'Invalid token'
    return
  }

  try {
    const result = await $trpc.user.verifyEmailChange.mutate({ token })
    verificationStatus.value = 'success'
    message.value = result.message

    // Force user to log in again with new email
    const auth = useAuth()

    // Invalidate and refresh the session before logout
    try {
      await auth.refresh()
    }
    catch (e) {
      console.error('Failed to refresh session', e)
    }

    // Then sign out and redirect after a delay
    setTimeout(async () => {
      await auth.signOut({ callbackUrl: '/auth' })
    }, 3000)
  }
  catch (error: unknown) {
    verificationStatus.value = 'error'
    message.value = error instanceof Error ? error.message : 'Failed to verify email change'
  }
})
</script>
