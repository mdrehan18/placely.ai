import { z } from 'zod';

export const createRoadmapSchema = z.object({
  body: z.object({
    goal: z.string({ required_error: 'Goal is required' }),
    duration: z.string({ required_error: 'Duration is required' }),
  })
});
