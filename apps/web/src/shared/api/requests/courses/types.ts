import { z } from 'zod'

export const coursesWithDetailsQuerySchema = z.object({
  authorId: z.string().optional(),
  userId: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['all', 'not_started', 'in_progress', 'completed']).optional().default('all'),
  search: z.string().optional(),
  limit: z.coerce.number().optional().default(10),
  offset: z.coerce.number().optional().default(0),
  sort: z.string().optional(),
  tab: z.enum(['all', 'my', 'new', 'recommended']).optional().default('all'),
  skill: z.string().optional(),
})

export type CourseWithDetailsQuery = z.infer<typeof coursesWithDetailsQuerySchema>
