import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../../trpc'
import { CreateLinkSchema, DeleteLinkSchema } from '~/server/schemas'

export const linkRouter = router({
  checkIfSlugExist: publicProcedure
    .input(z.string())
    .query(async ({ input: slug, ctx }) => {
      const result = await ctx.prisma.links.findUnique({
        where: {
          slug: slug,
        },
      })
      if (result) return true
      return false
    }),
  createLink: protectedProcedure
    .input(CreateLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.links.create({
        data: {
          ...input,
          creatorId: ctx.session.user.id,
        },
        include: {
          tags: true,
        },
      })
      return result
    }),
  getLinksAndTagsByUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const linkData = await ctx.prisma.links.findMany({
        where: {
          creatorId: ctx.session.user.id,
        },
        include: {
          tags: true,
        },
      })
      const tagsData = await ctx.prisma.tags.findMany({
        where: {
          creatorId: ctx.session.user.id,
        },
      })
      return {
        links: linkData,
        tags: tagsData,
      }
    }
    catch (error) {
      console.error('🚧 Error while fetching links and tags:', error)
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred.',
      })
    }
  }),
  deleteLink: protectedProcedure
    .input(DeleteLinkSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const link = await ctx.prisma.links.findUnique({
          where: {
            slug: input.slug,
          },
        })
        if (!link) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Link not found.',
          })
        }
        const result = await ctx.prisma.links.delete({
          where: {
            id: link.id,
            creatorId: ctx.session.user.id,
          },
          include: {
            tags: true,
          },
        })
        return result
      }
      catch (error) {
        console.error('🚧 Error while deleting link:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        })
      }
    }),
})
