import { z } from 'zod';

export const updateSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().min(1, 'Email is required').email().optional(),
    password: z.string().optional(),
});

export type UpdateSchema = z.infer<typeof updateSchema>;