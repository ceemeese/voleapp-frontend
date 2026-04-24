import { z } from 'zod';

export const updateMemberSchema = z.object({
    role: z.string().min(1, 'El rol es obligatorio'),
    
    isMember: z.boolean()
});

export type UpdateData = z.infer<typeof updateMemberSchema>;