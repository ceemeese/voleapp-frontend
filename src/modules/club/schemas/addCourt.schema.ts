import { z } from 'zod';

export const addCourtSchema = z.object({
    role: z.string().min(1, 'El rol es obligatorio'),
    
    isMember: z.boolean()
});

export type CourtFormData = z.infer<typeof addCourtSchema>;