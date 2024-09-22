import type { Links, LinkTags } from '@prisma/client'

import type { DefaultSession } from 'next-auth'

export type LinksWithTags = Links & {
  tags: LinkTags[]
}

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  username?: string | undefined
  isTwoFactorEnabled: boolean
  isOAuth: boolean
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      username: string | undefined
    } & DefaultSession['user']
  }
}
