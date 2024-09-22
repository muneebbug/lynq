// import { z } from 'zod'
// import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../../trpc'
import { UpdateProfileSchema } from '~/server/schemas'

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
})
