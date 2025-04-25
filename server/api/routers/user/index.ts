// import { z } from 'zod'
// import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../../trpc'
import { UpdateProfileSchema, ChangePasswordSchema, SetupPasswordSchema } from '~/server/schemas'
import { hashPassword } from '@/server/lib/tokens'

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
})
