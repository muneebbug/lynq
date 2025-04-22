<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { format } from 'date-fns'
import { BarChart3, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-vue-next'
import { CalendarDate, type DateValue, isEqualMonth } from '@internationalized/date'
import { type DateRange, RangeCalendarRoot, useDateFormatter } from 'reka-ui'
import { createMonth, type Grid, toDate } from 'reka-ui/date'

// UI Components
import type { Tags, LinkAnalytics } from '@prisma/client'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
} from '@/components/ui/range-calendar'

// Analytics components and utilities
import AnalyticsChart from '@/components/analytics/AnalyticsChart.vue'
import { cn } from '@/lib/utils'
import {
  exportToCSV,
  groupAnalyticsByTimeperiod,
  getTopReferrers,
  getTopDevices,
  getTopBrowsers,
  getTopOperatingSystems,
  getTopCountries,
} from '~/lib/analytics'
import type { AnalyticsData, AnalyticsEntry } from '~/types'

definePageMeta({
  layout: 'dashboard',
})

// State for filters
const { $trpc } = useNuxtApp()

const isLoading = ref(true)
const date = ref<{ from: Date, to: Date }>({
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  to: new Date(),
})

// Date range picker state
const dateRange = ref({
  start: new CalendarDate(date.value.from.getFullYear(), date.value.from.getMonth() + 1, date.value.from.getDate()),
  end: new CalendarDate(date.value.to.getFullYear(), date.value.to.getMonth() + 1, date.value.to.getDate()),
}) as Ref<DateRange>

const locale = ref('en-US')
const formatter = useDateFormatter(locale.value)

const placeholder = ref(dateRange.value.start) as Ref<DateValue>
const secondMonthPlaceholder = ref(dateRange.value.end) as Ref<DateValue>

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>
const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>

function updateMonth(reference: 'first' | 'second', months: number) {
  if (reference === 'first') {
    placeholder.value = placeholder.value.add({ months })
  }
  else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months,
    })
  }
}

watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months: 1,
    })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 })
})

// Watch for dateRange changes to update the date ref
watch(dateRange, (newRange) => {
  if (newRange.start && newRange.end) {
    date.value = {
      from: toDate(newRange.start),
      to: toDate(newRange.end),
    }
    fetchData()
  }
}, { deep: true })

const selectedTagIds = ref<string[]>([])
const timePeriod = ref<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily')
const chartType = ref<'line' | 'bar'>('bar')

// Type our refs properly
const tagsData = ref<Tags[]>([])
const analytics = ref<AnalyticsData>({
  links: [],
  analytics: [],
})

// Adapter function to convert between types
function adaptAnalyticsItemsToEntries(items: Omit<LinkAnalytics, 'link'>[]): AnalyticsEntry[] {
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

// Fetch data
const fetchData = async () => {
  isLoading.value = true
  try {
    // Get user's links and tags
    const linksAndTags = await $trpc.links.getLinksAndTagsByUser.query()
    tagsData.value = linksAndTags?.tags || []

    // Get analytics data
    const analyticsData = await $trpc.links.getAllUserAnalytics.query({
      startDate: date.value.from.toISOString(),
      endDate: date.value.to.toISOString(),
      tagIds: selectedTagIds.value,
      limit: 1000,
    })

    analytics.value = analyticsData
  }
  catch (error) {
    console.error('Error fetching analytics data', error)
  }
  finally {
    isLoading.value = false
  }
}

// Computed values for charts
const clicksByTime = computed(() => {
  return groupAnalyticsByTimeperiod(adaptAnalyticsItemsToEntries(analytics.value.analytics || []), timePeriod.value)
})

const topReferrers = computed(() => {
  return getTopReferrers(adaptAnalyticsItemsToEntries(analytics.value.analytics || [])).slice(0, 10)
})

const topDevices = computed(() => {
  return getTopDevices(adaptAnalyticsItemsToEntries(analytics.value.analytics || [])).slice(0, 5)
})

const topBrowsers = computed(() => {
  return getTopBrowsers(adaptAnalyticsItemsToEntries(analytics.value.analytics || [])).slice(0, 5)
})

const topOS = computed(() => {
  return getTopOperatingSystems(adaptAnalyticsItemsToEntries(analytics.value.analytics || [])).slice(0, 5)
})

const topCountries = computed(() => {
  return getTopCountries(adaptAnalyticsItemsToEntries(analytics.value.analytics || [])).slice(0, 5)
})

const topLinks = computed(() => {
  const clicksByLink: Record<string, number> = {}

  for (const click of analytics.value.analytics || []) {
    clicksByLink[click.linkId] = (clicksByLink[click.linkId] || 0) + 1
  }

  return Object.entries(clicksByLink)
    .map(([linkId, count]) => {
      const link = analytics.value.links.find(l => l.id === linkId)
      return {
        id: linkId,
        slug: link?.slug || 'Unknown',
        url: link?.url || '',
        count,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

const formattedDateRange = computed(() => {
  const from = format(date.value.from, 'PPP')
  const to = format(date.value.to, 'PPP')
  return `${from} - ${to}`
})

// Add this computed property
const uniqueLinksCount = computed(() => {
  return new Set(analytics.value.analytics.map((item: { linkId: string }) => item.linkId)).size
})

// Export data
const exportData = () => {
  if (analytics.value.analytics && analytics.value.analytics.length > 0) {
    const csvData = exportToCSV(adaptAnalyticsItemsToEntries(analytics.value.analytics))
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = format(new Date(), 'yyyy-MM-dd')

    link.setAttribute('href', url)
    link.setAttribute('download', `lynq-analytics-${timestamp}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Initialize
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 lg:gap-6 lg:p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold tracking-tight">
        Analytics Dashboard
      </h2>
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
            <RangeCalendarRoot
              v-slot="{ weekDays }"
              v-model="dateRange"
              v-model:placeholder="placeholder"
              class="p-3"
            >
              <div
                class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"
              >
                <div class="flex flex-col gap-4">
                  <div class="flex items-center justify-between">
                    <button
                      :class="
                        cn(
                          buttonVariants({ variant: 'outline' }),
                          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                        )
                      "
                      @click="updateMonth('first', -1)"
                    >
                      <ChevronLeft class="h-4 w-4" />
                    </button>
                    <div :class="cn('text-sm font-medium')">
                      {{
                        formatter.fullMonthAndYear(
                          toDate(firstMonth.value),
                        )
                      }}
                    </div>
                    <button
                      :class="
                        cn(
                          buttonVariants({ variant: 'outline' }),
                          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                        )
                      "
                      @click="updateMonth('first', 1)"
                    >
                      <ChevronRight class="h-4 w-4" />
                    </button>
                  </div>
                  <RangeCalendarGrid>
                    <RangeCalendarGridHead>
                      <RangeCalendarGridRow>
                        <RangeCalendarHeadCell
                          v-for="day in weekDays"
                          :key="day"
                          class="w-full"
                        >
                          {{ day }}
                        </RangeCalendarHeadCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridHead>
                    <RangeCalendarGridBody>
                      <RangeCalendarGridRow
                        v-for="(
                          weekDates, index
                        ) in firstMonth.rows"
                        :key="`weekDate-${index}`"
                        class="mt-2 w-full"
                      >
                        <RangeCalendarCell
                          v-for="weekDate in weekDates"
                          :key="weekDate.toString()"
                          :date="weekDate"
                        >
                          <RangeCalendarCellTrigger
                            :day="weekDate"
                            :month="firstMonth.value"
                          />
                        </RangeCalendarCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridBody>
                  </RangeCalendarGrid>
                </div>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center justify-between">
                    <button
                      :class="
                        cn(
                          buttonVariants({ variant: 'outline' }),
                          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                        )
                      "
                      @click="updateMonth('second', -1)"
                    >
                      <ChevronLeft class="h-4 w-4" />
                    </button>
                    <div :class="cn('text-sm font-medium')">
                      {{
                        formatter.fullMonthAndYear(
                          toDate(secondMonth.value),
                        )
                      }}
                    </div>

                    <button
                      :class="
                        cn(
                          buttonVariants({ variant: 'outline' }),
                          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                        )
                      "
                      @click="updateMonth('second', 1)"
                    >
                      <ChevronRight class="h-4 w-4" />
                    </button>
                  </div>
                  <RangeCalendarGrid>
                    <RangeCalendarGridHead>
                      <RangeCalendarGridRow>
                        <RangeCalendarHeadCell
                          v-for="day in weekDays"
                          :key="day"
                          class="w-full"
                        >
                          {{ day }}
                        </RangeCalendarHeadCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridHead>
                    <RangeCalendarGridBody>
                      <RangeCalendarGridRow
                        v-for="(
                          weekDates, index
                        ) in secondMonth.rows"
                        :key="`weekDate-${index}`"
                        class="mt-2 w-full"
                      >
                        <RangeCalendarCell
                          v-for="weekDate in weekDates"
                          :key="weekDate.toString()"
                          :date="weekDate"
                        >
                          <RangeCalendarCellTrigger
                            :day="weekDate"
                            :month="secondMonth.value"
                          />
                        </RangeCalendarCell>
                      </RangeCalendarGridRow>
                    </RangeCalendarGridBody>
                  </RangeCalendarGrid>
                </div>
              </div>
            </RangeCalendarRoot>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              size="sm"
            >
              <Filter class="mr-2 h-4 w-4" />
              <span>Filter</span>
              <Badge
                v-if="selectedTagIds.length > 0"
                variant="secondary"
                class="ml-2 rounded-sm px-1 font-normal"
              >
                {{ selectedTagIds.length }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            class="w-[200px] p-4"
            align="end"
          >
            <div class="space-y-2">
              <h4 class="font-medium leading-none">
                Tags
              </h4>
              <div class="space-y-1 pt-2">
                <div
                  v-for="tag in tagsData"
                  :key="tag.id"
                  class="flex items-center gap-2"
                >
                  <input
                    :id="`tag-${tag.id}`"
                    v-model="selectedTagIds"
                    type="checkbox"
                    :value="tag.id"
                    class="h-4 w-4 rounded border-gray-300"
                  >
                  <label
                    :for="`tag-${tag.id}`"
                    class="text-sm"
                  >
                    {{ tag.name }}
                  </label>
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  @click="fetchData"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          size="sm"
          variant="outline"
          @click="exportData"
        >
          <Download class="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <Skeleton
        v-for="i in 4"
        :key="i"
        class="h-40"
      />
    </div>

    <div
      v-else-if="!analytics.analytics || analytics.analytics.length === 0"
      class="flex flex-col items-center justify-center p-12 text-center"
    >
      <BarChart3 class="h-16 w-16 text-muted-foreground" />
      <h3 class="mt-4 text-lg font-medium">
        No analytics data available
      </h3>
      <p class="text-sm text-muted-foreground">
        There are no clicks recorded for your links in the selected date range or for selected tags.
      </p>
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <!-- Summary Cards -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ analytics.analytics.length }}
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formattedDateRange }}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Active Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ uniqueLinksCount }}
            </div>
            <p class="text-xs text-muted-foreground">
              Out of {{ analytics.links.length }} total links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Unique Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ topReferrers.length }}
            </div>
            <p class="text-xs text-muted-foreground">
              Sources of traffic
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Top Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ topDevices[0]?.device || 'None' }}
            </div>
            <p class="text-xs text-muted-foreground">
              {{ topDevices[0]?.count || 0 }} clicks
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Clicks Over Time -->
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
          <div class="flex items-center space-x-2">
            <Select
              v-model="timePeriod"
            >
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">
                  Hourly
                </SelectItem>
                <SelectItem value="daily">
                  Daily
                </SelectItem>
                <SelectItem value="weekly">
                  Weekly
                </SelectItem>
                <SelectItem value="monthly">
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent class="h-[300px]">
          <!-- Replace this with actual Chart.js component -->
          <div class="h-full">
            <client-only>
              <AnalyticsChart
                :data="clicksByTime"
                :chart-type="chartType"
                :height="280"
              />
              <template #fallback>
                <div class="flex h-full flex-col items-center justify-center">
                  <div class="text-center text-sm text-muted-foreground">
                    Time-based analysis showing {{ clicksByTime.length }} data points
                  </div>
                </div>
              </template>
            </client-only>
          </div>
        </CardContent>
      </Card>

      <!-- Two column layout -->
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Top Links -->
        <Card>
          <CardHeader>
            <CardTitle>Top Links</CardTitle>
            <CardDescription>
              Your most clicked links during the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead class="text-right">
                    Clicks
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="link in topLinks"
                  :key="link.id"
                >
                  <TableCell>
                    <div class="font-medium">
                      /{{ link.slug }}
                    </div>
                    <div class="text-xs text-muted-foreground truncate max-w-[180px]">
                      {{ link.url }}
                    </div>
                  </TableCell>
                  <TableCell class="text-right">
                    {{ link.count }}
                  </TableCell>
                </TableRow>
                <TableRow v-if="topLinks.length === 0">
                  <TableCell
                    colspan="2"
                    class="text-center text-muted-foreground"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <!-- Top Referrers -->
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>
              Sources driving traffic to your links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead class="text-right">
                    Clicks
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
                </TableRow>
                <TableRow v-if="topReferrers.length === 0">
                  <TableCell
                    colspan="2"
                    class="text-center text-muted-foreground"
                  >
                    No referrer data available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <!-- Device and Browser Stats -->
      <Tabs
        default-value="devices"
        class="w-full"
      >
        <TabsList>
          <TabsTrigger value="devices">
            Devices
          </TabsTrigger>
          <TabsTrigger value="browsers">
            Browsers
          </TabsTrigger>
          <TabsTrigger value="os">
            Operating Systems
          </TabsTrigger>
          <TabsTrigger value="countries">
            Countries
          </TabsTrigger>
        </TabsList>
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>
                Distribution of clicks by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="device in topDevices"
                  :key="device.device"
                  class="flex items-center"
                >
                  <div class="w-[180px] truncate">
                    {{ device.device }}
                  </div>
                  <div class="flex-1">
                    <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        class="h-full bg-primary"
                        :style="{
                          width: `${(device.count / analytics.analytics.length) * 100}%`,
                        }"
                      />
                    </div>
                  </div>
                  <div class="ml-4 w-12 text-right text-sm">
                    {{ device.count }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="browsers">
          <Card>
            <CardHeader>
              <CardTitle>Browsers</CardTitle>
              <CardDescription>
                Distribution of clicks by browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="browser in topBrowsers"
                  :key="browser.browser"
                  class="flex items-center"
                >
                  <div class="w-[180px] truncate">
                    {{ browser.browser }}
                  </div>
                  <div class="flex-1">
                    <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        class="h-full bg-primary"
                        :style="{
                          width: `${(browser.count / analytics.analytics.length) * 100}%`,
                        }"
                      />
                    </div>
                  </div>
                  <div class="ml-4 w-12 text-right text-sm">
                    {{ browser.count }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="os">
          <Card>
            <CardHeader>
              <CardTitle>Operating Systems</CardTitle>
              <CardDescription>
                Distribution of clicks by operating system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="os in topOS"
                  :key="os.os"
                  class="flex items-center"
                >
                  <div class="w-[180px] truncate">
                    {{ os.os }}
                  </div>
                  <div class="flex-1">
                    <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        class="h-full bg-primary"
                        :style="{
                          width: `${(os.count / analytics.analytics.length) * 100}%`,
                        }"
                      />
                    </div>
                  </div>
                  <div class="ml-4 w-12 text-right text-sm">
                    {{ os.count }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
              <CardDescription>
                Geographic distribution of clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                v-if="topCountries.length > 0"
                class="space-y-4"
              >
                <div
                  v-for="country in topCountries"
                  :key="country.country"
                  class="flex items-center"
                >
                  <div class="w-[180px] truncate">
                    {{ country.country }}
                  </div>
                  <div class="flex-1">
                    <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        class="h-full bg-primary"
                        :style="{
                          width: `${(country.count / analytics.analytics.length) * 100}%`,
                        }"
                      />
                    </div>
                  </div>
                  <div class="ml-4 w-12 text-right text-sm">
                    {{ country.count }}
                  </div>
                </div>
              </div>
              <div
                v-else
                class="py-8 text-center text-muted-foreground"
              >
                No country data available. Geolocation tracking requires additional setup.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
