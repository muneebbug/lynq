<script setup lang="ts">
import { Link, Link2, HelpCircle, Settings2, Share, UserCircle2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const sidebarItems = [
  {
    name: 'Links',
    href: '/dashboard',
    icon: Link2,
    external: false,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings2,
    external: false,
  },
]

const bottomNavItems = [
  {
    name: 'Help',
    href: 'https://github.com/muneebbug/lynq',
    icon: HelpCircle,
    external: true,
  },
  {
    name: 'Account',
    href: '/dashboard/account',
    icon: UserCircle2,
    external: false,
  },
]
</script>

<template>
  <div class="grid h-screen w-full pl-[56px]">
    <aside class="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div class="border-b p-2">
        <Button
          to="/"
          variant="outline"
          size="icon"
          aria-label="Home"
        >
          <Link class="size-5" />
        </Button>
      </div>
      <nav class="grid gap-1 p-2">
        <TooltipProvider
          v-for="item in sidebarItems"
          :key="item.name"
        >
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg"
                :to="item.href"
                :class="item.href === $route.path ? 'bg-muted' : ''"
                aria-label="Playground"
                :external="item.external"
              >
                <component
                  :is="item.icon"
                  class="size-5"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              :side-offset="5"
            >
              {{ item.name }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav class="mt-auto grid gap-1 p-2">
        <TooltipProvider
          v-for="item in bottomNavItems"
          :key="item.name"
        >
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg"
                :to="item.href"
                :class="item.href === $route.path ? 'bg-muted' : ''"
                aria-label="Playground"
                :external="item.external"
                :target="item.external ? '_blank' : ''"
              >
                <component
                  :is="item.icon"
                  class="size-5"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              :side-offset="5"
            >
              {{ item.name }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
    <div class="flex flex-col">
      <header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 class="text-xl font-semibold">
          Dashboard
        </h1>
        <Button
          variant="outline"
          size="sm"
          class="ml-auto text-sm"
        >
          <Share class="size-3.5" />
          <span>
            Share
          </span>
        </Button>
      </header>
      <main class="grid flex-1 gap-4 overflow-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
