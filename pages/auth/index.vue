<template>
  <div class="flex flex-col items-center justify-center">
    <Tabs
      v-model="activeTab"
      class="w-full max-w-sm w-[400px]"
    >
      <!-- Tabs Header -->
      <TabsList class="w-full grid grid-cols-2 mb-4">
        <TabsTrigger
          value="login"
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          value="register"
        >
          Register
        </TabsTrigger>
      </TabsList>

      <!-- Login Content -->
      <TabsContent
        value="login"
        class="w-full"
      >
        <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800 dark:text-neutral-50 w-full duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
          <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
            <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
              Log in to Lynq
            </h3>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 duration-500 animate-in fade-in-30">
              Enter your email below to login to your account
            </p>
          </div>

          <div class="p-6 pt-0">
            <form
              class="space-y-4"
              @submit.prevent="handleLogin"
            >
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  v-model="loginForm.email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label for="password">Password</Label>
                  <NuxtLink
                    to="/auth/forgot-password"
                    class="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </NuxtLink>
                </div>
                <Input
                  id="password"
                  v-model="loginForm.password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div
                v-if="loginError"
                class="text-sm text-destructive"
              >
                {{ loginError }}
              </div>

              <Button
                type="submit"
                class="w-full"
                :disabled="loginLoading"
                :loading="loginLoading"
              >
                Sign In
              </Button>
            </form>

            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t" />
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div class="mt-5 flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  class="w-full"
                  :disabled="loginLoading"
                  @click="signInWithGoogle"
                >
                  <Icon
                    name="simple-icons:google"
                    class="mr-2 w-4 h-4"
                  />
                  Login with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="w-full"
                  :disabled="loginLoading"
                  @click="signInWithAuth0"
                >
                  <Icon
                    name="simple-icons:auth0"
                    class="mr-2 w-4 h-4 text-[#ec592b]"
                  />
                  Login with Auth0
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- Register Content -->
      <TabsContent
        value="register"
        class="w-full"
      >
        <div class="rounded-xl border border-neutral-100 text-neutral-950 shadow dark:border-neutral-800 dark:text-neutral-50 w-full duration-300 animate-in fade-in-15 slide-in-from-bottom-3">
          <div class="flex-col space-y-1.5 p-6 flex items-center justify-center text-center">
            <h3 class="tracking-tight text-2xl font-medium duration-500 animate-in fade-in-20">
              Create an account
            </h3>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 duration-500 animate-in fade-in-30">
              Enter your information below to create your account
            </p>
          </div>

          <div class="p-6 pt-0">
            <form
              class="space-y-4"
              @submit.prevent="handleRegister"
            >
              <div class="space-y-2">
                <Label for="register-name">Name</Label>
                <Input
                  id="register-name"
                  v-model="registerForm.name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="register-email">Email</Label>
                <Input
                  id="register-email"
                  v-model="registerForm.email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="register-password">Password</Label>
                <Input
                  id="register-password"
                  v-model="registerForm.password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                <p class="text-xs text-muted-foreground">
                  Password must be at least 8 characters and include uppercase, lowercase, and numbers
                </p>
              </div>

              <div
                v-if="registerError"
                class="text-sm text-destructive"
              >
                {{ registerError }}
              </div>

              <Button
                type="submit"
                class="w-full"
                :disabled="registerLoading"
                :loading="registerLoading"
              >
                Create Account
              </Button>
            </form>

            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t" />
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div class="mt-5 flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  class="w-full"
                  :disabled="registerLoading"
                  @click="signInWithGoogle"
                >
                  <Icon
                    name="simple-icons:google"
                    class="mr-2 w-4 h-4"
                  />
                  Sign up with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="w-full"
                  :disabled="registerLoading"
                  @click="signInWithAuth0"
                >
                  <Icon
                    name="simple-icons:auth0"
                    class="mr-2 w-4 h-4 text-[#ec592b]"
                  />
                  Sign up with Auth0
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'auth',
})

// Active tab state
const activeTab = ref('login')

// Auth hook
const { signIn, status } = useAuth()

// If user is already authenticated, redirect to dashboard
if (status.value === 'authenticated') {
  navigateTo('/dashboard')
}

// Login related state
const loginForm = ref({
  email: '',
  password: '',
})
const loginLoading = ref(false)
const loginError = ref('')

// Register related state
const registerForm = ref({
  name: '',
  email: '',
  password: '',
})
const registerLoading = ref(false)
const registerError = ref('')

// Social login handlers
async function signInWithAuth0() {
  if (activeTab.value === 'login') {
    loginLoading.value = true
  }
  else {
    registerLoading.value = true
  }

  try {
    await signIn('auth0')
  }
  catch (error) {
    console.error('Auth0 login error:', error)
    if (activeTab.value === 'login') {
      loginError.value = 'Failed to login with Auth0'
    }
    else {
      registerError.value = 'Failed to sign up with Auth0'
    }
  }
  finally {
    if (activeTab.value === 'login') {
      loginLoading.value = false
    }
    else {
      registerLoading.value = false
    }
  }
}

async function signInWithGoogle() {
  if (activeTab.value === 'login') {
    loginLoading.value = true
  }
  else {
    registerLoading.value = true
  }

  try {
    await signIn('google')
  }
  catch (error) {
    console.error('Google login error:', error)
    if (activeTab.value === 'login') {
      loginError.value = 'Failed to login with Google'
    }
    else {
      registerError.value = 'Failed to sign up with Google'
    }
  }
  finally {
    if (activeTab.value === 'login') {
      loginLoading.value = false
    }
    else {
      registerLoading.value = false
    }
  }
}

// Form submission handlers
async function handleLogin() {
  loginLoading.value = true
  loginError.value = ''

  try {
    const result = await signIn('credentials', {
      email: loginForm.value.email,
      password: loginForm.value.password,
      redirect: false,
    })

    if (result?.error) {
      // Special handling for OAuth users who haven't set a password
      if (result.error.includes('Please use social login or reset your password')) {
        loginError.value = 'This account uses social login. You can set up a password via "Forgot Password".'
      }
      else {
        loginError.value = result.error
      }
    }
    else {
      // Navigate to dashboard on successful login
      navigateTo('/dashboard')
    }
  }
  catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An error occurred during login'
  }
  finally {
    loginLoading.value = false
  }
}

async function handleRegister() {
  registerLoading.value = true
  registerError.value = ''

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: registerForm.value.name,
        email: registerForm.value.email,
        password: registerForm.value.password,
      },
    })

    if (response.status === 'success') {
      toast.success(response.message)
      // Switch to login tab after successful registration
      activeTab.value = 'login'
    }
    else {
      registerError.value = response.message
    }
  }
  catch (error: unknown) {
    console.error('Registration error:', error)
    registerError.value = error instanceof Error ? error.message : 'An error occurred during registration'
  }
  finally {
    registerLoading.value = false
  }
}
</script>
