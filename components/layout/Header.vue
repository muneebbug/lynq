<template>
  <header>
    <nav
      data-state="false"
      class="w-full pt-2"
    >
      <div class="mx-auto rounded-3xl px-6 transition-all duration-300 lg:px-12">
        <div class="relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6">
          <div class="flex w-full items-center justify-between gap-8 lg:w-auto">
            <Button
              aria-label="home"
              variant="outline"
              class="flex items-center space-x-2"
              to="/"
            >
              <Link class="size-5" />
            </Button>

            <!-- Mobile Menu Trigger -->
            <Sheet v-model:open="mobileMenuOpen">
              <SheetTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="lg:hidden"
                  aria-label="Toggle Menu"
                >
                  <Menu class="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                class="w-full gap-0"
              >
                <SheetHeader class="border-b">
                  <SheetTitle class="flex items-center gap-2">
                    <Button
                      aria-label="home"
                      variant="outline"
                      size="icon"
                      to="/"
                    >
                      <Link class="size-4" />
                    </Button>
                    <span>Lynq</span>
                  </SheetTitle>
                </SheetHeader>
                <div>
                  <nav class="flex flex-col divide-y divide-border/70 border border-border/70 rounded-md overflow-hidden">
                    <NuxtLink
                      to="/"
                      class="flex items-center px-4 py-4 hover:bg-secondary/80 text-foreground group transition-colors"
                      @click="mobileMenuOpen = false"
                    >
                      <div class="border border-border/70 rounded-md p-1.5 mr-3">
                        <Home class="size-4" />
                      </div>
                      <span class="font-medium">Home</span>
                    </NuxtLink>
                    <NuxtLink
                      to="/changelog"
                      class="flex items-center px-4 py-4 hover:bg-secondary/80 text-foreground group transition-colors"
                      @click="mobileMenuOpen = false"
                    >
                      <div class="border border-border/70 rounded-md p-1.5 mr-3">
                        <History class="size-4" />
                      </div>
                      <span class="font-medium">Changelog</span>
                    </NuxtLink>
                  </nav>
                </div>

                <!-- Account button at the bottom -->
                <div class="mt-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      v-if="isAuthenticated"
                      as-child
                    >
                      <Button
                        variant="outline"
                        class="w-full justify-between rounded-none py-8"
                      >
                        <div class="flex items-center">
                          <Avatar class="h-8 w-8 mr-3 ring-2 ring-primary/20">
                            <AvatarImage :src="data?.user?.image || ''" />
                            <AvatarFallback>{{ getInitials(data?.user?.name) }}</AvatarFallback>
                          </Avatar>
                          <div class="text-left">
                            <span class="font-medium">{{ data?.user?.name }}</span>
                            <p class="text-xs text-muted-foreground truncate max-w-[150px]">
                              {{ data?.user?.email }}
                            </p>
                          </div>
                        </div>
                        <ChevronDown class="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      class="w-56"
                    >
                      <div class="p-2 space-y-1">
                        <p class="text-sm font-medium">
                          {{ data?.user?.name }}
                        </p>
                        <p class="text-xs text-neutral-500 truncate">
                          {{ data?.user?.email }}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <NuxtLink
                          to="/dashboard"
                          class="flex w-full items-center"
                          @click="mobileMenuOpen = false"
                        >
                          <LayoutDashboard
                            :size="16"
                            class="mr-2"
                          />
                          <span>Dashboard</span>
                        </NuxtLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <NuxtLink
                          to="/dashboard/settings"
                          class="flex w-full items-center"
                          @click="mobileMenuOpen = false"
                        >
                          <Settings
                            :size="16"
                            class="mr-2"
                          />
                          <span>Settings</span>
                        </NuxtLink>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="logout">
                        <LogOut
                          :size="16"
                          class="mr-2"
                        />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <!-- Auth buttons -->
                  <div
                    v-if="!isAuthenticated"
                    class="grid w-full max-w-full grid-cols-2 gap-4 p-4"
                  >
                    <Button
                      to="/auth"
                      variant="outline"
                    >
                      Login
                    </Button>
                    <Button
                      to="/auth"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div class="hidden lg:block">
              <ul class="flex gap-6 text-sm text-foreground">
                <li>
                  <NuxtLink
                    class="block duration-150"
                    to="/"
                  >
                    <span>Home</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    class="block duration-150"
                    to="/changelog"
                  >
                    <span>Changelog</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
          >
            <!-- Auth buttons - show when not logged in -->
            <div
              v-if="!isAuthenticated"
              class="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit"
            >
              <Button
                variant="outline"
                to="/auth"
              >
                Login
              </Button>
              <Button
                to="/auth"
              >
                Sign Up
              </Button>
            </div>

            <!-- User Account - show when logged in -->
            <div v-else-if="isAuthenticated">
              <HeaderUserAccountPopover />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Menu, Link, Home, History, ChevronDown, LogOut, LayoutDashboard, Settings } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import HeaderUserAccountPopover from '@/components/header/UserAccountPopover.vue'

// Mobile menu state
const mobileMenuOpen = ref(false)

// User authentication state
const { data, status, signOut } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')

function getInitials(name?: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

async function logout() {
  mobileMenuOpen.value = false
  await signOut({ redirect: true, callbackUrl: '/auth' })
}
</script>
