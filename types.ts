import type { Links, LinkTags } from '@prisma/client'

export type LinksWithTags = Links & {
  tags: LinkTags[]
}
