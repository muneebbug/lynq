import { router } from './trpc'
import { userRouter } from './routers/user'
import { linkRouter } from './routers/link'

export const appRouter = router({
  user: userRouter,
  links: linkRouter,
})

export type AppRouter = typeof appRouter
