import { z } from 'zod';

export const createProblemSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], { required_error: 'Difficulty is required' }),
    tags: z.array(z.string()).optional(),
    link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  })
});

export const updateProblemSchema = z.object({
  body: z.object({
    status: z.enum(['Unsolved', 'Solving', 'Solved']).optional(),
    notes: z.string().optional(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  })
});
