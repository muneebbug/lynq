// import { z } from 'zod'
// import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../../trpc'
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  SetupPasswordSchema,
  DeleteAccountSchema,
  EmailChangeSchema,
} from '~/server/schemas'
import { hashPassword, generateEmailChangeToken } from '@/server/lib/tokens'
import { prisma } from '@/server/prisma'

export const userRouter = router({
  public: publicProcedure.query(() => {
    return { data: 'Hello from public TRPC endpoint!' }
  }),
  isAuthed: protectedProcedure
    .query(() => {
      return {
        status: 'ok',
        data: 'authenticated',
      } as const
    }),
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
          email: ctx.session.user.isOAuth ? undefined : input.email,
        },
      })
      return result
    }),
  changePassword: protectedProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (!user || !user.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid credentials',
        })
      }

      const isValid = await bcrypt.compare(input.currentPassword, user.password)
      if (!isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is incorrect',
        })
      }

      const hashedPassword = await hashPassword(input.newPassword)

      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: hashedPassword,
        },
      })
    }),
  setupPassword: protectedProcedure
    .input(SetupPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User not found',
        })
      }

      // Check if the user already has a password set
      if (user.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Password is already set',
        })
      }

      const hashedPassword = await hashPassword(input.newPassword)

      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: hashedPassword,
          emailVerified: user.emailVerified || new Date(),
        },
      })
    }),
  hasPassword: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          password: true,
        },
      })

      return { hasPassword: !!user?.password }
    }),
  deleteAccount: protectedProcedure
    .input(DeleteAccountSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Verify password for confirmation if the user has a password
      if (user.password) {
        if (!input.password) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Password is required to delete account',
          })
        }

        const isValid = await bcrypt.compare(input.password, user.password)
        if (!isValid) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Password is incorrect',
          })
        }
      }

      // Delete the user account
      await ctx.prisma.user.delete({
        where: {
          id: ctx.session.user.id,
        },
      })

      return { success: true }
    }),
  // Request email change
  requestEmailChange: protectedProcedure
    .input(EmailChangeSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Check if the user is using OAuth
      if (ctx.session.user.isOAuth) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot change email for OAuth accounts',
        })
      }

      // Check if the new email is same as current email
      if (user.email === input.newEmail) {
        // They're changing back to their original email, cancel any pending changes
        const pendingEmailChange = await ctx.prisma.emailChangeToken.findFirst({
          where: {
            userId: ctx.session.user.id,
          },
        })

        if (pendingEmailChange) {
          console.log('pendingEmailChange', pendingEmailChange)
          await ctx.prisma.emailChangeToken.delete({
            where: {
              id: pendingEmailChange.id,
            },
          })
        }

        return {
          success: true,
          message: 'Email verification cancelled - using current email',
        }
      }

      // Check if the email is already in use
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.newEmail,
        },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already in use',
        })
      }

      // Always delete any existing tokens before creating a new one
      await ctx.prisma.emailChangeToken.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      })

      // Generate email change token and send verification email
      await generateEmailChangeToken(
        ctx.session.user.id,
        user.email as string,
        input.newEmail,
      )

      return {
        success: true,
        message: 'Verification email sent to your new address',
      }
    }),

  // Verify email change
  verifyEmailChange: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      // Find the email change token
      const emailChangeToken = await prisma.emailChangeToken.findUnique({
        where: {
          token: input.token,
        },
      })

      if (!emailChangeToken) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid or expired token',
        })
      }

      // Check if token is expired
      const isExpired = new Date() > new Date(emailChangeToken.expires)
      if (isExpired) {
        await prisma.emailChangeToken.delete({
          where: {
            id: emailChangeToken.id,
          },
        })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Token has expired',
        })
      }

      // Update the user's email
      await prisma.user.update({
        where: {
          id: emailChangeToken.userId,
        },
        data: {
          email: emailChangeToken.newEmail,
          emailVerified: new Date(),
        },
      })

      // Delete the token
      await prisma.emailChangeToken.delete({
        where: {
          id: emailChangeToken.id,
        },
      })

      return {
        success: true,
        message: 'Email changed successfully',
      }
    }),

  // Get pending email change request
  getPendingEmailChange: protectedProcedure
    .query(async ({ ctx }) => {
      const pendingChange = await ctx.prisma.emailChangeToken.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          newEmail: true,
          expires: true,
        },
      })

      return pendingChange
    }),
})
