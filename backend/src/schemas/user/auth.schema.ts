import { z} from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nim: z.coerce.string().trim().regex(/^\d+$/, 'NIM must contain numbers only'),
    email: z.string().min(1, 'Email is required').email(),
    password: z.string().min(1, 'Password is required'),
})

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email(),
    password: z.string().min(1, 'Password is required').optional()
})




