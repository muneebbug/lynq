export interface ChangelogEntry {
  version: string
  date: string
  title: string
  description?: string
  changes: {
    type: 'feat' | 'fix' | 'refactor' | 'chore' | 'ui' | 'remove' | 'temp'
    title: string
    description?: string
  }[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: 'v0.0.1-alpha',
    date: 'April 24, 2025',
    title: 'v0.0.1-alpha Release',
    description: 'First public alpha release of Lynq with core link management and analytics functionality after several months of development.',
    changes: [
      {
        type: 'feat',
        title: 'Link Management',
        description: 'Create, edit, delete and search links with custom slugs and descriptions',
      },
      {
        type: 'feat',
        title: 'Analytics Dashboard',
        description: 'Track and visualize link performance with detailed analytics and metrics',
      },
      {
        type: 'feat',
        title: 'Tag System',
        description: 'Organize links with customizable tags and filter by tags',
      },
      {
        type: 'feat',
        title: 'QR Code Generation',
        description: 'Generate and download QR codes for any shortened link',
      },
      {
        type: 'feat',
        title: 'User Authentication',
        description: 'Secure authentication system with GitHub OAuth integration',
      },
      {
        type: 'feat',
        title: 'Modern UI Components',
        description: 'Beautiful interface built with shadcn-vue and Tailwind v4',
      },
      {
        type: 'feat',
        title: 'Profile Management',
        description: 'User profile customization and account settings',
      },
      {
        type: 'feat',
        title: 'Link Sharing Options',
        description: 'Easy sharing with copy to clipboard functionality',
      },
      {
        type: 'feat',
        title: 'Click Metrics',
        description: 'Detailed statistics on link performance and engagement',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'April 20, 2025',
    title: 'Database and Cache Updates',
    description: 'Database migration and caching improvements.',
    changes: [
      {
        type: 'temp',
        title: 'No-cache implementation',
        description: 'Temporarily forced no-cache, with plans to add proper caching later',
      },
      {
        type: 'chore',
        title: 'Database migration',
        description: 'Migrated from Supabase PostgreSQL to CockroachDB',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'April 13, 2025',
    title: 'Redirect Improvements',
    description: 'Improved redirect performance and reliability.',
    changes: [
      {
        type: 'refactor',
        title: 'Redirect logic',
        description: 'Refactored redirect logic for better performance',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'September 23, 2024',
    title: 'Server-Sent Events Updates',
    description: 'Changes to server-sent events functionality.',
    changes: [
      {
        type: 'remove',
        title: 'SSE removal',
        description: 'Removed server-sent events functionality',
      },
      {
        type: 'temp',
        title: 'Vercel SSE support',
        description: 'Temporary changes to test Vercel server-sent events support',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'September 22, 2024',
    title: 'Database and Profile Updates',
    description: 'Various fixes and improvements for database and user profiles.',
    changes: [
      {
        type: 'fix',
        title: 'Vercel PostgreSQL fix',
        description: 'Fixed issue with Vercel PostgreSQL when lazy is dynamically assigned',
      },
      {
        type: 'fix',
        title: 'Database connection',
        description: 'Fixed Vercel database connection issues',
      },
      {
        type: 'fix',
        title: 'AsyncData optimization',
        description: 'Optimized lazy loading of data only when state is empty',
      },
      {
        type: 'fix',
        title: 'Tags and links insertion',
        description: 'Fixed tags and links to be inserted at the beginning instead of the end after creation',
      },
      {
        type: 'feat',
        title: 'Profile updates',
        description: 'Added ability to update general profile information and improved session data',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'September 21, 2024',
    title: 'UI and Dashboard Improvements',
    description: 'Visual improvements and bug fixes for the dashboard.',
    changes: [
      {
        type: 'ui',
        title: 'Card links styling',
        description: 'Applied background color to card links for better visual appearance',
      },
      {
        type: 'remove',
        title: 'Remove leftover declarations',
        description: 'Removed leftover APP_BASE_URL declaration from dashboard',
      },
      {
        type: 'fix',
        title: 'Dashboard responsiveness',
        description: 'Fixed responsiveness issues on the dashboard',
      },
      {
        type: 'fix',
        title: 'Header text',
        description: 'Fixed header text display',
      },
      {
        type: 'refactor',
        title: 'Dynamic base URL',
        description: 'Implemented dynamic APP_BASE_URL from .env for local and deployed instances',
      },
      {
        type: 'fix',
        title: 'Search functionality',
        description: 'Added search functionality based on destination URL, slug, and description',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'September 17-18, 2024',
    title: 'Tags and Link Management',
    description: 'Improvements to tag management and link handling.',
    changes: [
      {
        type: 'refactor',
        title: 'Time display',
        description: 'Added time display in the last clicked component',
      },
      {
        type: 'fix',
        title: 'Button color',
        description: 'Fixed button color in create tag dialog',
      },
      {
        type: 'feat',
        title: 'Tag management',
        description: 'Added ability to create/delete tags and filter links using tags',
      },
      {
        type: 'fix',
        title: 'Empty state handling',
        description: 'Improved empty state handling for filtered links and added search capability',
      },
      {
        type: 'fix',
        title: 'Error page and sorting',
        description: 'Fixed error page and link sorting on dashboard',
      },
      {
        type: 'feat',
        title: 'Click metrics',
        description: 'Added display for number of clicks per link',
      },
      {
        type: 'feat',
        title: 'Link sharing options',
        description: 'Added ability to copy links as text and view/download as QR codes',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'September 15-16, 2024',
    title: 'Link Management and Auth Improvements',
    description: 'Core functionality for managing links and authentication improvements.',
    changes: [
      {
        type: 'feat',
        title: 'Link editing',
        description: 'Added ability to edit existing links',
      },
      {
        type: 'fix',
        title: 'Card-link class',
        description: 'Fixed card-link class styling',
      },
      {
        type: 'feat',
        title: 'Link management',
        description: 'Added functionality to create and delete links',
      },
      {
        type: 'refactor',
        title: 'Auth routes',
        description: 'Changed /auth/login route to /auth for cleaner navigation',
      },
      {
        type: 'refactor',
        title: 'Global middleware',
        description: 'Improved global middleware code structure',
      },
      {
        type: 'fix',
        title: 'Auth middleware',
        description: 'Fixed global middleware infinite loop and added GitHub OAuth',
      },
    ],
  },
  {
    version: 'pre-release',
    date: 'September 13, 2024',
    title: 'Project Setup',
    description: 'Initial project setup and authentication system.',
    changes: [
      {
        type: 'feat',
        title: 'Authentication',
        description: 'Implemented authentication via @sidebase/nuxt-auth and next-auth',
      },
      {
        type: 'chore',
        title: 'Build configuration',
        description: 'Removed Prisma from build and generate scripts in package.json',
      },
      {
        type: 'chore',
        title: 'Project initialization',
        description: 'Initial project setup and repository creation',
      },
    ],
  },
]
