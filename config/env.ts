import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url().nonempty(),
  NUXT_SECRET: z.string().nonempty().min(16),
  AUTH_ORIGIN: z.string().url().default('http://localhost:3000'),
  NUXT_AUTH0_CLIENT_ID: z.string().optional(),
  NUXT_AUTH0_CLIENT_SECRET: z.string().optional(),
  NUXT_AUTH0_ISSUER: z.string().url().optional(),

  // GitHub
  NUXT_GITHUB_CLIENT_ID: z.string().optional(),
  NUXT_GITHUB_CLIENT_SECRET: z.string().optional(),
})

const parsedSchema = envSchema.safeParse(process.env)

if (parsedSchema.success === false) {
  console.error('😔 Your env is invalid!',
    parsedSchema.error.flatten().fieldErrors)
  throw new Error('😔 Your env is invalid!')
}

export const env = parsedSchema.data
