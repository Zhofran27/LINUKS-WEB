import { z } from 'zod';

export const updateSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    nim: z.coerce.string().trim().regex(/^\d+$/, 'NIM must contain numbers only').optional(),
    email: z.string().min(1, 'Email is required').email().optional(),
    password: z.string().optional(),
});

export type UpdateSchema = z.infer<typeof updateSchema>;
