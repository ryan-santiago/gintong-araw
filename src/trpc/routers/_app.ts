import { z } from 'zod'

// import { agentsRouter } from '@/modules/agents/server/procedures'
import { membersRouter } from '@/modules/members/server/procedures'

import { createTRPCRouter } from '../init'
export const appRouter = createTRPCRouter({
	// agents: agentsRouter,
	members: membersRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
