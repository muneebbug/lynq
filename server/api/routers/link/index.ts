import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../../trpc'
import { CreateLinkSchema, DeleteLinkSchema, EditLinkSchema } from '~/server/schemas'
import { publish } from '~/server/pubsub'

export const linkRouter = router({
  clickedLink: publicProcedure
    .query(async () => {
      publish('linkClicked', {
        clicks: new Date(),
      })
      return {
        status: 'ok',
      }
    }),
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
  getLink: publicProcedure
    .input(z.string())
    .query(async ({ input: slug, ctx }) => {
      try {
        const result = await ctx.prisma.links.findUnique({
          where: {
            slug: slug,
          },
          include: {
            tags: true,
          },
        })
        if (!result) {
          return {
            error: false,
            message: '🚧 Error: Slug not found or invalid.',
            redirect404: true,
          }
        }
        await ctx.prisma.links.update({
          where: {
            id: result.id,
          },
          data: {
            clicks: {
              increment: 1,
            },
            lastClicked: new Date(),
          },
        })
        publish('linkClicked', {
          id: result.id,
          slug: result.slug,
          clicks: result.clicks, // Incremented clicks
          lastClicked: new Date(),
        })

        return {
          error: false,
          message: 'success',
          url: result?.url,
        }
      }
      catch (error) {
        console.error('🚧 Error while fetching link:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        })
      }
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
        orderBy: {
          createdAt: 'desc',
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
        const result = await ctx.prisma.links.delete({
          where: {
            slug: input.slug,
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
  updateLink: protectedProcedure
    .input(EditLinkSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.links.update({
          where: {
            id: input.id,
            creatorId: ctx.session.user.id,
          },
          data: {
            ...input,
          },
          include: {
            tags: true,
          },
        })
        return result
      }
      catch (error) {
        console.error('🚧 Error while updating link:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        })
      }
    }),
})
