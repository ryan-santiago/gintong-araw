// import { agentsRouter } from '@/modules/agents/server/procedures'
import { membersRouter } from '@/modules/members/server/procedures'
import { attendanceRouter } from '@/modules/attendance/server/procedures'
import { dashboardRouter } from '@/modules/home/server/procedures'

import { createTRPCRouter } from '../init'
export const appRouter = createTRPCRouter({
	// agents: agentsRouter,
	members: membersRouter,
	attendance: attendanceRouter,
	dashboard: dashboardRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
