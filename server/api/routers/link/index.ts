import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../../trpc'
import { CreateLinkSchema, DeleteLinkSchema, EditLinkSchema } from '~/server/schemas'

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

        // Analytics data is now collected in the redirect middleware

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
  // Analytics procedures
  getLinkAnalytics: protectedProcedure
    .input(z.object({
      linkId: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().default(100),
    }))
    .query(async ({ input, ctx }) => {
      try {
        // Check if the link belongs to the user
        const link = await ctx.prisma.links.findFirst({
          where: {
            id: input.linkId,
            creatorId: ctx.session.user.id,
          },
        })

        if (!link) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this link data.',
          })
        }

        // Build query conditions
        const where: Prisma.LinkAnalyticsWhereInput = {
          linkId: input.linkId,
        }

        if (input.startDate) {
          where.clickedAt = {
            gte: new Date(input.startDate),
            ...(where.clickedAt as Prisma.DateTimeFilter || {}),
          }
        }

        if (input.endDate) {
          where.clickedAt = {
            ...(where.clickedAt as Prisma.DateTimeFilter || {}),
            lte: new Date(input.endDate),
          }
        }

        // Get analytics data
        const analytics = await ctx.prisma.linkAnalytics.findMany({
          where,
          orderBy: {
            clickedAt: 'desc',
          },
          take: input.limit,
        })

        return analytics
      }
      catch (error) {
        console.error('🚧 Error fetching link analytics:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        })
      }
    }),
  getAllUserAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      tagIds: z.array(z.string()).optional(),
      limit: z.number().default(500),
    }))
    .query(async ({ input, ctx }) => {
      try {
        // Build query conditions for links
        const linksWhere: Prisma.LinksWhereInput = { creatorId: ctx.session.user.id }

        // Filter by tags if specified
        if (input.tagIds && input.tagIds.length > 0) {
          linksWhere.tags = {
            some: {
              tagId: {
                in: input.tagIds,
              },
            },
          }
        }

        // Get user's links
        const links = await ctx.prisma.links.findMany({
          where: linksWhere,
          select: {
            id: true,
            slug: true,
            url: true,
            clicks: true,
            lastClicked: true,
          },
        })

        const linkIds = links.map(link => link.id)

        // Build query conditions for analytics
        const analyticsWhere: Prisma.LinkAnalyticsWhereInput = {
          linkId: { in: linkIds },
        }

        if (input.startDate) {
          analyticsWhere.clickedAt = {
            gte: new Date(input.startDate),
            ...(analyticsWhere.clickedAt as Prisma.DateTimeFilter || {}),
          }
        }

        if (input.endDate) {
          analyticsWhere.clickedAt = {
            ...(analyticsWhere.clickedAt as Prisma.DateTimeFilter || {}),
            lte: new Date(input.endDate),
          }
        }

        // Get analytics data
        const analytics = await ctx.prisma.linkAnalytics.findMany({
          where: analyticsWhere,
          orderBy: {
            clickedAt: 'desc',
          },
          take: input.limit,
        })

        return {
          links,
          analytics,
        }
      }
      catch (error) {
        console.error('🚧 Error fetching user analytics:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        })
      }
    }),
})
