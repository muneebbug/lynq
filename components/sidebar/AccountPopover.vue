<script setup lang="ts">
import { UserCircle2, LogOut } from 'lucide-vue-next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const { data, signOut } = useAuth()
const user = computed(() => data.value?.user)

async function handleLogout() {
  await signOut({ redirect: true, callbackUrl: '/auth' })
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="rounded-lg"
              aria-label="Account"
            >
              <UserCircle2 class="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            :side-offset="5"
          >
            Account
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </PopoverTrigger>
    <PopoverContent
      class="w-64 p-4"
      side="right"
    >
      <div class="flex flex-col space-y-3">
        <div class="flex flex-col space-y-1">
          <h4 class="font-medium text-sm">
            {{ user?.name || 'User' }}
          </h4>
          <p class="text-xs text-muted-foreground truncate">
            {{ user?.email || 'No email provided' }}
          </p>
        </div>
        <Separator />
        <Button
          variant="outline"
          class="w-full justify-start"
          @click="handleLogout"
        >
          <LogOut class="mr-2 size-4" />
          <span>Logout</span>
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
