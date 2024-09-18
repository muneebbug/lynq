<template>
  <TooltipProvider :delay-duration="500">
    <Tooltip>
      <TooltipTrigger
        class="flex cursor-default items-center space-x-2 text-xs"
      >
        <BarChart :size="14" />
        <span class="font-mono">{{ props.numberOfClicks }} clicks</span>
      </TooltipTrigger>
      <TooltipContent :side-offset="5">
        <template v-if="lastDate">
          Last clicked: {{ formatDateTime(props.lastDate!) }}
        </template>
        <template v-else>
          No clicks yet
        </template>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script lang="ts" setup>
import { BarChart } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDateTime } from '@/lib/utils'

interface ShowClicksProps {
  numberOfClicks: number
  lastDate: Date | null
}

const props = defineProps<ShowClicksProps>()
</script>

<style>

</style>
