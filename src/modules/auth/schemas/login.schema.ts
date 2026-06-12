import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Obligatorio'),
    password: z.string().min(1, 'Obligatorio'),
});
