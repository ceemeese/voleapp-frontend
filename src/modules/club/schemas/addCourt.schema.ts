import { z } from 'zod';

export const addCourtSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    basePrice: z.coerce.number().nonnegative().min(0.01,'El precio debe ser mayor que 0'),
    type:z.string().min(1, 'El tipo de pista es obligatorio'),
    isActive: z.boolean()
});

export type CourtAddFormData = z.infer<typeof addCourtSchema>;


export const updateCourtSchema = addCourtSchema.pick({
    name: true,
    basePrice: true
})

export type CourtUpdateFormData = z.infer<typeof updateCourtSchema>;