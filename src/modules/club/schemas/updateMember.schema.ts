import { z } from 'zod';

export const updateMemberSchema = z.object({
    role: z.string().min(1, 'El rol es obligatorio'),
    membershipNumber: z.string().or(z.literal('')) ,
    isMember: z.boolean()
});

export type UpdateData = z.infer<typeof updateMemberSchema>;