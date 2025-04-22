import type { Links, LinkTags, LinkAnalytics } from '@prisma/client'

import type { DefaultSession } from 'next-auth'

/**
 * Represents a link with its associated tags
 */
export type LinksWithTags = Links & {
  tags: LinkTags[]
}

/**
 * Extended user type with additional properties
 */
export type ExtendedUser = DefaultSession['user'] & {
  id: string
  username?: string | undefined
  isTwoFactorEnabled: boolean
  isOAuth: boolean
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      username: string | undefined
    } & DefaultSession['user']
  }
}

/**
 * Analytics entry for processing and displaying analytics data
 * Based on Prisma's LinkAnalytics with frontend-specific modifications
 */
export type AnalyticsEntry = Omit<LinkAnalytics, 'link'> & {
  linkId: string // We ensure linkId is always required
}

/**
 * Data structure for grouped analytics data used in charts
 */
export interface ChartDataPoint {
  date: string
  count: number
}

/**
 * Data structure for aggregated analytics data
 */
export interface AnalyticsData {
  links: Partial<Links>[]
  analytics: Omit<LinkAnalytics, 'link'>[]
}

/**
 * Property count record for analytics aggregation
 */
export type PropertyCount<T extends keyof AnalyticsEntry> = Record<T, string> & { count: number }
