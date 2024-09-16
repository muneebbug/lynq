// file: ~/server/api/auth/[...].ts
import Auth0Provider from 'next-auth/providers/auth0'
// import type { User } from '@prisma/client'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NuxtAuthHandler } from '#auth'
import { prisma } from '@/server/prisma'
import { env } from '@/config'

// extend the types of the default session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    }
  }
}

export default NuxtAuthHandler({
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      return session
    },
  },
  adapter: PrismaAdapter(prisma),

  secret: env.NUXT_SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    Auth0Provider.default({
      clientId: env.NUXT_AUTH0_CLIENT_ID,
      clientSecret: env.NUXT_AUTH0_CLIENT_SECRET,
      issuer: env.NUXT_AUTH0_ISSUER,
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GitHubProvider.default({
      clientId: env.NUXT_GITHUB_CLIENT_ID as string,
      clientSecret: env.NUXT_GITHUB_CLIENT_SECRET as string,
    }),
  ],
})
