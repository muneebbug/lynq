<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="transition-opacity hover:opacity-75">
        <Avatar class="h-10 w-10">
          <AvatarImage :src="user?.image || ''" />
          <AvatarFallback>{{ getInitials(user?.name) }}</AvatarFallback>
        </Avatar>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="w-56"
    >
      <div class="p-2 space-y-1">
        <p class="text-sm font-medium">
          {{ user?.name }}
        </p>
        <p class="text-xs text-neutral-500 truncate">
          {{ user?.email }}
        </p>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <NuxtLink
          to="/dashboard"
          class="flex w-full items-center"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LogOut, LayoutDashboard, Settings } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'

const { data, signOut } = useAuth()
const user = computed(() => data.value?.user)

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
  await signOut({ redirect: true, callbackUrl: '/auth' })
}
</script>
