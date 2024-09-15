// import { z } from 'zod'
// import { TRPCError } from '@trpc/server'
import { protectedProcedure, publicProcedure, router } from '../../trpc'

export const userRouter = router({
  public: publicProcedure.query(() => {
    return { data: 'Hello from public TRPC endpoint!' }
  }),
  isAuthed: protectedProcedure
    .query(() => {
      return {
        type: 'ok',
        data: 'you are authed!',
      } as const
    }),
})
