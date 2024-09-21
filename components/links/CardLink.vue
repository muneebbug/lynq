<template>
  <div class="flex w-full flex-col rounded-md border border-neutral-200 p-3 shadow-sm dark:border-neutral-800 bg-muted/40">
    <div class="mb-1 flex w-full items-center justify-between space-x-2">
      <NuxtLink
        external
        target="_blank"
        :to="`/${props.linkInfo.slug}`"
        class="block space-x-[1px] overflow-hidden truncate font-medium transition-opacity duration-75 hover:opacity-80"
      >
        <span class="text-sm opacity-40">/</span>
        <span>{{ props.linkInfo.slug }}</span>
      </NuxtLink>
      <div class="flex items-center space-x-3">
        <ShowClicks
          :number-of-clicks="props.linkInfo.clicks"
          :last-date="props.linkInfo.lastClicked"
        />
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="transition-opacity hover:opacity-75"
              as-child
            >
              <button id="copy-link">
                <Copy
                  :size="15"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <CopyLinkDropdown :slug="linkInfo.slug" />
              <DialogTrigger
                id="copy-qr-code"
                as-child
              >
                <DropdownMenuItem
                  class="space-x-3"
                >
                  <QrCode :size="15" />
                  <span>Copy QR Code</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <CopyQR :link-info="props.linkInfo" />
        </Dialog>
        <EditLink :link="props.linkInfo">
          <button
            class="transition-opacity hover:opacity-75"
          >
            <Settings :size="16" />
          </button>
        </EditLink>
        <DeleteLink :link="props.linkInfo">
          <button
            class="transition-opacity hover:opacity-75"
          >
            <Trash :size="16" />
          </button>
        </DeleteLink>
      </div>
    </div>
    <p
      class="mb-2 truncate font-mono text-sm text-neutral-500 dark:text-neutral-400"
      :title="props.linkInfo.url"
    >
      {{ props.linkInfo.url }}
    </p>
    <div class="flex items-center justify-between font-mono text-xs font-medium text-neutral-600 dark:text-neutral-400 md:space-x-2">
      <div class="flex max-w-[75%] items-center space-x-2">
        <p
          class="hidden truncate md:block"
        >
          {{ linkInfo.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LinkTags, Links, Tags } from '@prisma/client'
import { Copy, QrCode, Settings, Trash } from 'lucide-vue-next'
import CopyLinkDropdown from '@/components/links/CopyLinkDropdown.vue'
import EditLink from '@/components/links/EditLink.vue'
import DeleteLink from '@/components/links/DeleteLink.vue'
import CopyQR from '@/components/links/CopyQR.vue'
import ShowClicks from '@/components/links/ShowClicks.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CardLinkProps {
  linkInfo: Links
  linkTags: LinkTags[]
  tagsInfo: Tags[]
}

const props = defineProps<CardLinkProps>()
</script>
