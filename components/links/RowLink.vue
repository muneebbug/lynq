<template>
  <div class="flex w-full items-center justify-between rounded-md border border-neutral-200 p-3 shadow-sm dark:border-neutral-800 bg-card">
    <div class="flex flex-1 items-center space-x-4 overflow-hidden">
      <NuxtLink
        external
        target="_blank"
        :to="`/${props.linkInfo.slug}`"
        class="min-w-[120px] max-w-[150px] overflow-hidden truncate font-medium transition-opacity duration-75 hover:opacity-80"
      >
        <span class="text-sm opacity-40">/</span>
        <span>{{ props.linkInfo.slug }}</span>
      </NuxtLink>

      <p
        class="flex-1 truncate font-mono text-sm text-neutral-500 dark:text-neutral-400"
        :title="props.linkInfo.url"
      >
        {{ props.linkInfo.url }}
      </p>

      <p class="hidden truncate text-sm md:block max-w-[200px]">
        {{ linkInfo.description }}
      </p>
    </div>

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

      <LinkAnalytics
        :link-id="props.linkInfo.id"
        :link-slug="props.linkInfo.slug"
        :total-clicks="props.linkInfo.clicks"
      >
        <button
          class="transition-opacity hover:opacity-75"
        >
          <BarChart :size="16" />
        </button>
      </LinkAnalytics>

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
          <Trash2 :size="16" />
        </button>
      </DeleteLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Copy, Settings, Trash2, QrCode, BarChart } from 'lucide-vue-next'
import type { LinkTags, Tags, Links } from '@prisma/client'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CopyLinkDropdown from '@/components/links/CopyLinkDropdown.vue'
import CopyQR from '@/components/links/CopyQR.vue'
import ShowClicks from '@/components/links/ShowClicks.vue'
import LinkAnalytics from '@/components/links/LinkAnalytics.vue'
import EditLink from '@/components/links/EditLink.vue'
import DeleteLink from '@/components/links/DeleteLink.vue'

interface RowLinkProps {
  linkInfo: Links
  linkTags: LinkTags[]
  tagsInfo: Tags[]
}

const props = defineProps<RowLinkProps>()
</script>
