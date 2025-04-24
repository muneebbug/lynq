// file: ~/server/api/auth/[...].ts
import Auth0Provider from 'next-auth/providers/auth0'
// import type { User } from '@prisma/client'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

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
      try {
        // Allow OAuth without email verification
        if (account?.provider !== 'credentials') {
          // When signing in with OAuth, check if there's already an account with this email
          // We don't need to do anything here, just allow login
          return true
        }

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
      }
      catch (error) {
        console.error('Sign in callback error:', error)
        return false
      }
    },
    async session({ session, token }) {
      try {
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
        }

        return session
      }
      catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
    async jwt({ token }) {
      try {
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
      }
      catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
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
      allowDangerousEmailAccountLinking: true,
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: env.NUXT_GOOGLE_CLIENT_ID,
      clientSecret: env.NUXT_GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: { email: string, password: string }) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials')
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            throw new Error('Invalid email or password')
          }

          // If the user doesn't have a password (OAuth user trying to login with credentials)
          // and hasn't set one up yet
          if (!user.password) {
            throw new Error('Please use social login or reset your password')
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          )

          if (!passwordMatch) {
            throw new Error('Invalid email or password')
          }

          // Handle two-factor authentication if enabled
          if (user.isTwoFactorEnabled) {
            const twoFactorToken = await prisma.twoFactorToken.findFirst({
              where: { email: credentials.email },
            })

            const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
              where: { userId: user.id },
            })

            if (!twoFactorConfirmation) {
              throw new Error('Two factor authentication required')
            }

            // If there's already a token, delete it before creating a new one
            if (twoFactorToken) {
              await prisma.twoFactorToken.delete({
                where: { id: twoFactorToken.id },
              })
            }
          }

          return user
        }
        catch (error) {
          console.error('Authorization error:', error)
          throw error
        }
      },
    }),
  ],
})
