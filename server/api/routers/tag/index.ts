import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, router } from '../../trpc'
import { CreateTagSchema } from '~/server/schemas'

export const tagRouter = router({
  createTag: protectedProcedure
    .input(CreateTagSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.tags.create({
          data: {
            ...input,
            creatorId: ctx.session.user.id,
          },
        })
        return result
      }
      catch (error) {
        console.error('🚧 Error while creating tag:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        })
      }
    }),
  removeTag: protectedProcedure
    .input(z.object({
      tagId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.tags.delete({
        where: {
          id: input.tagId,
        },
      })
      return result
    }),
})
