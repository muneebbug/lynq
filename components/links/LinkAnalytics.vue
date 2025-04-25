<script setup lang="ts">
import { CalendarIcon, BarChart3, Download } from 'lucide-vue-next'
import { format } from 'date-fns'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { exportToCSV, groupAnalyticsByTimeperiod, getTopReferrers, getTopDevices, getTopBrowsers, getTopOperatingSystems } from '~/lib/analytics'
import AnalyticsChart from '@/components/analytics/AnalyticsChart.vue'
import type { AnalyticsEntry } from '@/types'

const props = defineProps<{
  linkId: string
  linkSlug: string
  totalClicks: number
}>()

const isLoading = ref(true)
const analytics = ref<AnalyticsEntry[]>([])
const { $trpc } = useNuxtApp()
const date = ref<{ from: Date, to: Date }>({
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  to: new Date(),
})
const timePeriod = ref<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily')

// Define API response type
interface AnalyticsApiResponse {
  id: string
  linkId: string
  clickedAt: Date
  ipAddress: string | null
  country: string | null
  city: string | null
  region: string | null
  device: string | null
  browser: string | null
  os: string | null
  referer: string | null
  userAgent: string | null
}

// Adapter function to convert API response to AnalyticsEntry
function adaptToAnalyticsEntries(items: AnalyticsApiResponse[]): AnalyticsEntry[] {
  return items.map(item => ({
    id: item.id,
    linkId: item.linkId,
    clickedAt: item.clickedAt,
    ipAddress: item.ipAddress,
    country: item.country,
    city: item.city,
    region: item.region,
    device: item.device,
    browser: item.browser,
    os: item.os,
    referer: item.referer,
    userAgent: item.userAgent,
  }))
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const data = await $trpc.links.getLinkAnalytics.query({
      linkId: props.linkId,
      startDate: date.value.from.toISOString(),
      endDate: date.value.to.toISOString(),
      limit: 500,
    })
    analytics.value = adaptToAnalyticsEntries(data)
  }
  catch (error) {
    console.error('Error fetching link analytics', error)
  }
  finally {
    isLoading.value = false
  }
}

const formattedDateRange = computed(() => {
  const from = format(date.value.from, 'PPP')
  const to = format(date.value.to, 'PPP')
  return `${from} - ${to}`
})

const clicksByTime = computed(() => {
  return groupAnalyticsByTimeperiod(analytics.value, timePeriod.value)
})

const topReferrers = computed(() => {
  return getTopReferrers(analytics.value).slice(0, 5)
})

const topDevices = computed(() => {
  return getTopDevices(analytics.value).slice(0, 5)
})

const topBrowsers = computed(() => {
  return getTopBrowsers(analytics.value).slice(0, 5)
})

const topOS = computed(() => {
  return getTopOperatingSystems(analytics.value).slice(0, 5)
})

// Export data
const exportData = () => {
  if (analytics.value && analytics.value.length > 0) {
    const csvData = exportToCSV(analytics.value)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = format(new Date(), 'yyyy-MM-dd')

    link.setAttribute('href', url)
    link.setAttribute('download', `lynq-${props.linkSlug}-analytics-${timestamp}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot>
        <Button
          variant="outline"
          size="sm"
        >
          <BarChart3 class="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <BarChart3 class="h-5 w-5" />
          Analytics for /{{ linkSlug }}
        </DialogTitle>
        <DialogDescription>
          View detailed click analytics for this link
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-center justify-between mt-4">
        <div>
          <span class="text-sm text-muted-foreground">Total clicks: </span>
          <span class="font-semibold">{{ totalClicks }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                size="sm"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ formattedDateRange }}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              class="w-auto p-0"
              align="end"
            >
              <Calendar
                v-model:range="date"
                mode="range"
                class="p-3"
                @update:model-value="fetchData"
              />
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            variant="outline"
            @click="exportData"
          >
            <Download class="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="py-10"
      >
        <div class="flex justify-center">
          <Skeleton class="h-[350px] w-full" />
        </div>
      </div>

      <div
        v-else-if="analytics.length === 0"
        class="flex flex-col items-center justify-center py-10 text-center"
      >
        <BarChart3 class="h-12 w-12 text-muted-foreground" />
        <h3 class="mt-4 text-lg font-medium">
          No analytics data available
        </h3>
        <p class="text-sm text-muted-foreground">
          There are no clicks recorded for this link in the selected date range.
        </p>
      </div>

      <div
        v-else
        class="mt-4 space-y-6"
      >
        <!-- Clicks Over Time -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium">
              Clicks Over Time
            </h3>
            <div class="flex items-center">
              <div class="flex items-center space-x-1 text-xs">
                <button
                  v-for="period in ['hourly', 'daily', 'weekly', 'monthly']"
                  :key="period"
                  :class="[
                    'px-2 py-1 rounded-md',
                    timePeriod === period ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                  ]"
                  @click="timePeriod = period as any"
                >
                  {{ period.charAt(0).toUpperCase() + period.slice(1) }}
                </button>
              </div>
            </div>
          </div>

          <div class="h-[200px] rounded-md border p-4">
            <client-only>
              <AnalyticsChart
                :data="clicksByTime"
                :chart-type="'bar'"
                :height="180"
              />
              <template #fallback>
                <div class="flex h-full flex-col items-center justify-center">
                  <div class="text-center text-sm text-muted-foreground">
                    Time-based analysis: {{ clicksByTime.length }} data points for {{ timePeriod }} view
                  </div>
                </div>
              </template>
            </client-only>
          </div>
        </div>

        <!-- Tabs for different stats -->
        <Tabs
          default-value="referrers"
          class="w-full"
        >
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger value="referrers">
              Referrers
            </TabsTrigger>
            <TabsTrigger value="devices">
              Devices
            </TabsTrigger>
            <TabsTrigger value="browsers">
              Browsers
            </TabsTrigger>
            <TabsTrigger value="os">
              Operating Systems
            </TabsTrigger>
          </TabsList>

          <!-- Referrers Tab -->
          <TabsContent value="referrers">
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead class="text-right">
                      Clicks
                    </TableHead>
                    <TableHead class="text-right">
                      Percentage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(referrer, index) in topReferrers"
                    :key="index"
                  >
                    <TableCell>{{ referrer.referer || 'Direct' }}</TableCell>
                    <TableCell class="text-right">
                      {{ referrer.count }}
                    </TableCell>
                    <TableCell class="text-right">
                      {{ ((referrer.count / analytics.length) * 100).toFixed(1) }}%
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="topReferrers.length === 0">
                    <TableCell
                      colspan="3"
                      class="text-center text-muted-foreground"
                    >
                      No referrer data available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <!-- Devices Tab -->
          <TabsContent value="devices">
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead class="text-right">
                      Clicks
                    </TableHead>
                    <TableHead class="text-right">
                      Percentage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="device in topDevices"
                    :key="device.device"
                  >
                    <TableCell>{{ device.device }}</TableCell>
                    <TableCell class="text-right">
                      {{ device.count }}
                    </TableCell>
                    <TableCell class="text-right">
                      {{ ((device.count / analytics.length) * 100).toFixed(1) }}%
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="topDevices.length === 0">
                    <TableCell
                      colspan="3"
                      class="text-center text-muted-foreground"
                    >
                      No device data available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <!-- Browsers Tab -->
          <TabsContent value="browsers">
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Browser</TableHead>
                    <TableHead class="text-right">
                      Clicks
                    </TableHead>
                    <TableHead class="text-right">
                      Percentage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="browser in topBrowsers"
                    :key="browser.browser"
                  >
                    <TableCell>{{ browser.browser }}</TableCell>
                    <TableCell class="text-right">
                      {{ browser.count }}
                    </TableCell>
                    <TableCell class="text-right">
                      {{ ((browser.count / analytics.length) * 100).toFixed(1) }}%
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="topBrowsers.length === 0">
                    <TableCell
                      colspan="3"
                      class="text-center text-muted-foreground"
                    >
                      No browser data available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <!-- OS Tab -->
          <TabsContent value="os">
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operating System</TableHead>
                    <TableHead class="text-right">
                      Clicks
                    </TableHead>
                    <TableHead class="text-right">
                      Percentage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="os in topOS"
                    :key="os.os"
                  >
                    <TableCell>{{ os.os }}</TableCell>
                    <TableCell class="text-right">
                      {{ os.count }}
                    </TableCell>
                    <TableCell class="text-right">
                      {{ ((os.count / analytics.length) * 100).toFixed(1) }}%
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="topOS.length === 0">
                    <TableCell
                      colspan="3"
                      class="text-center text-muted-foreground"
                    >
                      No operating system data available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  </Dialog>
</template>
