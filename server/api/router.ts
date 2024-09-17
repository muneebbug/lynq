import { router } from './trpc'
import { userRouter } from './routers/user'
import { linkRouter } from './routers/link'
import { tagRouter } from './routers/tag'

export const appRouter = router({
  user: userRouter,
  links: linkRouter,
  tags: tagRouter,
})

export type AppRouter = typeof appRouter
