<template>
  <div class="flex flex-col items-center justify-center">
    <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800  dark:text-neutral-50 w-full max-w-sm duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
      <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
        <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
          Log in to Lynq
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 duration-500 animate-in fade-in-30">
          Log in with your favorite social provider to get started:
        </p>
      </div>
      <div class="p-6 pt-0 grid gap-4 duration-500 animate-in fade-in-30">
        <div class="flex flex-col items-center justify-center space-y-2">
          <Button
            type="button"
            variant="outline"
            class="w-full"
            @click="signInWithAuth0"
          >
            <Icon
              name="simple-icons:auth0"
              class="mr-2 w-4 h-4 text-[#ec592b]"
            />
            Login with Auth0
          </Button>
          <Button
            type="button"
            variant="outline"
            class="w-full"
            @click="signInWithGithub"
          >
            <Icon
              name="simple-icons:github"
              class="mr-2 w-4 h-4"
            />
            Login with Github
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'auth',
})

const { signIn } = useAuth()

async function signInWithAuth0() {
  await signIn('auth0')
}
async function signInWithGithub() {
  await signIn('github')
}
</script>
