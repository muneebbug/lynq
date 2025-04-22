import { UAParser } from 'ua-parser-js'
import type { AnalyticsEntry, ChartDataPoint, PropertyCount } from '~/types'

/**
 * Parses the user agent string to extract device, browser, and OS information
 * @param userAgent - The user agent string to parse
 * @returns Object containing device, browser, and OS information
 */
export function parseUserAgent(userAgent: string): {
  device: string
  browser: string
  os: string
} {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  const deviceType = result.device.type || 'desktop'
  const deviceVendor = result.device.vendor || ''
  const deviceModel = result.device.model || ''

  const browserName = result.browser.name || 'Unknown'
  const browserVersion = result.browser.version || ''
  const browserString = `${browserName} ${browserVersion}`.trim()

  const osName = result.os.name || 'Unknown'
  const osVersion = result.os.version || ''
  const osString = `${osName} ${osVersion}`.trim()

  let deviceString = deviceType
  if (deviceVendor && deviceModel) {
    deviceString = `${deviceVendor} ${deviceModel}`
  }
  else if (deviceVendor) {
    deviceString = deviceVendor
  }
  else if (deviceModel) {
    deviceString = deviceModel
  }

  return {
    device: deviceString,
    browser: browserString,
    os: osString,
  }
}

/**
 * Groups analytics entries by time period
 * @param analytics - The analytics entries to group
 * @param period - The time period to group by (hourly, daily, weekly, monthly)
 * @returns Array of data points with date and count
 */
export function groupAnalyticsByTimeperiod(analytics: AnalyticsEntry[], period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'): ChartDataPoint[] {
  const grouped: Record<string, number> = {}

  for (const entry of analytics) {
    const date = new Date(entry.clickedAt)
    let key = ''

    switch (period) {
      case 'hourly':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`
        break
      case 'daily':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        break
      case 'weekly': {
        // Get the first day of the week (Sunday)
        const firstDayOfWeek = new Date(date)
        const dayOfWeek = date.getDay()
        firstDayOfWeek.setDate(date.getDate() - dayOfWeek)
        key = `${firstDayOfWeek.getFullYear()}-${(firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${firstDayOfWeek.getDate().toString().padStart(2, '0')}`
        break
      }
      case 'monthly':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        break
    }

    grouped[key] = (grouped[key] || 0) + 1
  }

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

/**
 * Calculates Click-Through Rate (CTR)
 * @param clickCount - Number of clicks
 * @param impressionCount - Number of impressions
 * @returns CTR as a percentage
 */
export function calculateCTR(clickCount: number, impressionCount: number): number {
  if (impressionCount === 0) return 0
  return (clickCount / impressionCount) * 100
}

/**
 * Gets top referrers from analytics entries
 * @param analytics - The analytics entries to analyze
 * @returns Array of referrers with counts, sorted by count
 */
export function getTopReferrers(analytics: AnalyticsEntry[]): { referer: string, count: number }[] {
  const referrers: Record<string, number> = {}

  for (const entry of analytics) {
    if (entry.referer) {
      try {
        const url = new URL(entry.referer)
        const hostname = url.hostname
        referrers[hostname] = (referrers[hostname] || 0) + 1
      }
      catch (_error) {
        console.error('Invalid URL:', _error)
        // If invalid URL, use as-is
        referrers[entry.referer] = (referrers[entry.referer] || 0) + 1
      }
    }
  }

  return Object.entries(referrers)
    .map(([referer, count]) => ({ referer, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Gets top devices from analytics entries
 * @param analytics - The analytics entries to analyze
 * @returns Array of devices with counts, sorted by count
 */
export function getTopDevices(analytics: AnalyticsEntry[]): { device: string, count: number }[] {
  return getPropertyCounts(analytics, 'device')
}

/**
 * Gets top browsers from analytics entries
 * @param analytics - The analytics entries to analyze
 * @returns Array of browsers with counts, sorted by count
 */
export function getTopBrowsers(analytics: AnalyticsEntry[]): { browser: string, count: number }[] {
  return getPropertyCounts(analytics, 'browser')
}

/**
 * Gets top operating systems from analytics entries
 * @param analytics - The analytics entries to analyze
 * @returns Array of operating systems with counts, sorted by count
 */
export function getTopOperatingSystems(analytics: AnalyticsEntry[]): { os: string, count: number }[] {
  return getPropertyCounts(analytics, 'os')
}

/**
 * Gets top countries from analytics entries
 * @param analytics - The analytics entries to analyze
 * @returns Array of countries with counts, sorted by count
 */
export function getTopCountries(analytics: AnalyticsEntry[]): { country: string, count: number }[] {
  return getPropertyCounts(analytics, 'country')
}

/**
 * Generic function to get property counts from analytics entries
 * @param analytics - The analytics entries to analyze
 * @param property - The property to count
 * @returns Array of property values with counts, sorted by count
 */
function getPropertyCounts<T extends keyof AnalyticsEntry>(analytics: AnalyticsEntry[], property: T): PropertyCount<T>[] {
  const counts: Record<string, number> = {}

  for (const entry of analytics) {
    const value = entry[property]
    if (value) {
      counts[value as string] = (counts[value as string] || 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([value, count]) => ({ [property]: value, count } as PropertyCount<T>))
    .sort((a, b) => b.count - a.count)
}

/**
 * Exports analytics entries to CSV format
 * @param analytics - The analytics entries to export
 * @returns CSV string
 */
export function exportToCSV(analytics: AnalyticsEntry[]): string {
  if (analytics.length === 0) return ''

  const headers = Object.keys(analytics[0]).join(',')
  const rows = analytics.map((entry) => {
    return Object.values(entry)
      .map((value) => {
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes if needed
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(',')
  })

  return [headers, ...rows].join('\n')
}
