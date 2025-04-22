// Import using CommonJS syntax
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// User ID to associate links with
const userId = 'cm9sut6dg0000dissyz5m3rvx'

// Generate random click count between min and max
function getRandomClicks(min = 0, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate random date for last clicked within the past 30 days
function getRandomLastClicked() {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const result = new Date(now)
  result.setDate(result.getDate() - daysAgo)
  return result
}

// Sample link data with varied descriptions and URLs
const linksData = [
  {
    url: 'https://github.com/prisma/prisma',
    slug: 'prisma-orm',
    description: '🚀 Modern database toolkit for TypeScript & Node.js',
    clicks: getRandomClicks(50, 500),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://nuxt.com',
    slug: 'nuxt3',
    description: 'The intuitive Vue framework for building your next web app',
    clicks: getRandomClicks(100, 800),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://vuejs.org',
    slug: 'vue-js',
    description: '✨ Progressive JavaScript framework for building UIs',
    clicks: getRandomClicks(200, 1000),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://tailwindcss.com',
    slug: 'tailwind',
    description: 'A utility-first CSS framework for rapid UI development',
    clicks: getRandomClicks(80, 600),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://nextjs.org',
    slug: 'next-js',
    description: 'The React framework for production',
    clicks: getRandomClicks(150, 750),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://shadcn-vue.com',
    slug: 'shadcn',
    description: '🎨 Beautiful UI components built with Tailwind CSS',
    clicks: getRandomClicks(60, 450),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://pinia.vuejs.org',
    slug: 'pinia',
    description: '🍍 Intuitive, type safe and flexible Store for Vue',
    clicks: getRandomClicks(40, 300),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://trpc.io',
    slug: 'trpc',
    description: 'End-to-end typesafe APIs made easy',
    clicks: getRandomClicks(30, 400),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://www.typescriptlang.org',
    slug: 'typescript',
    description: '💪 JavaScript with syntax for types',
    clicks: getRandomClicks(100, 900),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://vitejs.dev',
    slug: 'vite',
    description: '⚡ Next generation frontend tooling',
    clicks: getRandomClicks(70, 500),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://github.com/features/copilot',
    slug: 'copilot',
    description: '🤖 AI pair programmer that helps you write code faster',
    clicks: getRandomClicks(120, 800),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://www.docker.com',
    slug: 'docker',
    description: 'Build, share, and run applications with containers',
    clicks: getRandomClicks(90, 700),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://aws.amazon.com',
    slug: 'aws',
    description: '☁️ Amazon Web Services - Cloud computing services',
    clicks: getRandomClicks(200, 1000),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://code.visualstudio.com',
    slug: 'vscode',
    description: 'Free, built on open source. Runs everywhere.',
    clicks: getRandomClicks(150, 950),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://www.figma.com',
    slug: 'figma',
    description: '🎨 Collaborative interface design tool',
    clicks: getRandomClicks(80, 650),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://vercel.com',
    slug: 'vercel',
    description: 'Deploy any frontend app with a single command',
    clicks: getRandomClicks(100, 800),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://nestjs.com',
    slug: 'nestjs',
    description: '🦅 Progressive Node.js framework for server-side applications',
    clicks: getRandomClicks(50, 400),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://rxjs.dev',
    slug: 'rxjs',
    description: 'Reactive Extensions Library for JavaScript',
    clicks: getRandomClicks(30, 350),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://lodash.com',
    slug: 'lodash',
    description: '🛠️ A modern JavaScript utility library',
    clicks: getRandomClicks(75, 550),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://firebase.google.com',
    slug: 'firebase',
    description: '🔥 App development platform backed by Google',
    clicks: getRandomClicks(120, 850),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://www.mongodb.com',
    slug: 'mongodb',
    description: 'Document database for modern applications',
    clicks: getRandomClicks(90, 650),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://www.postgresql.org',
    slug: 'postgres',
    description: '🐘 The world\'s most advanced open source database',
    clicks: getRandomClicks(85, 600),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://redis.io',
    slug: 'redis',
    description: '⚡ In-memory data structure store',
    clicks: getRandomClicks(40, 400),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://jestjs.io',
    slug: 'jest',
    description: '🃏 Delightful JavaScript Testing Framework',
    clicks: getRandomClicks(60, 500),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://cypress.io',
    slug: 'cypress',
    description: 'Fast, easy and reliable testing for anything that runs in a browser',
    clicks: getRandomClicks(45, 450),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://playwright.dev',
    slug: 'playwright',
    description: '🎭 Reliable end-to-end testing for modern web apps',
    clicks: getRandomClicks(30, 350),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://kubernetes.io',
    slug: 'k8s',
    description: '⎈ Production-grade container orchestration',
    clicks: getRandomClicks(70, 600),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://graphql.org',
    slug: 'graphql',
    description: 'A query language for your API',
    clicks: getRandomClicks(55, 500),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://github.com/features/actions',
    slug: 'gh-actions',
    description: '🔄 Automate your workflow from idea to production',
    clicks: getRandomClicks(65, 550),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
  {
    url: 'https://www.digitalocean.com',
    slug: 'digitalocean',
    description: '💧 Simple cloud hosting, built for developers',
    clicks: getRandomClicks(40, 400),
    lastClicked: getRandomClicks() > 100 ? getRandomLastClicked() : null,
    createdBy: { connect: { id: userId } },
  },
]

async function main() {
  console.log('Start seeding links...')

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!userExists) {
    console.log(`Creating user with ID: ${userId}`)
    // Create the user if they don't exist yet
    await prisma.user.create({
      data: {
        id: userId,
        email: 'demo@lynq.app',
        name: 'Demo User',
      },
    })
  }

  // Create links
  for (const link of linksData) {
    try {
      const createdLink = await prisma.links.create({
        data: link,
      })
      console.log(`Created link: ${createdLink.slug} with ${createdLink.clicks} clicks`)
    }
    catch (error) {
      console.error(`Failed to create link ${link.slug}:`, error)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
