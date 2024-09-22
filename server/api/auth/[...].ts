// file: ~/server/api/auth/[...].ts
import Auth0Provider from 'next-auth/providers/auth0'
// import type { User } from '@prisma/client'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NuxtAuthHandler } from '#auth'
import { prisma } from '@/server/prisma'
import { env } from '@/config'

// extend the types of the default session

export default NuxtAuthHandler({
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      const existingUser = await prisma.user.findFirst({ where: { id: user.id } })

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findFirst(
          {
            where: {
              id: existingUser.id,
            },
          },
        )

        if (!twoFactorConfirmation) return false

        // Delete two factor confirmation for next sign in
        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email!
        session.user.isOAuth = token.isOAuth as boolean
        // console.log('session.user', session.user)
        // console.log('token', token)
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await prisma.user.findFirst({ where: { id: token.sub } })

      if (!existingUser) return token

      const existingAccount = await prisma.account.findFirst({
        where: { userId: token.sub },
      })

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.limitLinks = existingUser.limitLinks

      return token
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
