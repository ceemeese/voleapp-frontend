import { z } from 'zod';

export const updatePricingSchema = z.object({
    rainDiscountPercent: z.coerce.number()
        .min(0, 'Mínimo 0%')
        .max(100, 'Máximo 100%'),
    windThreshold: z.coerce.number()
        .min(0,'Mínimo 0 km/h'),
    windDiscountPercent:z.coerce.number()
        .min(0, 'Mínimo 0%')
        .max(100, 'Máximo 100%'),
    heatThreshold: z.coerce.number()
        .min(20, 'Mínimo 20°C')
        .max(40, 'Máximo 40°C'),
    heatDiscountPercent: z.coerce.number()
        .min(0, 'Mínimo 0%')
        .max(100, 'Máximo 100%'),
    coldThreshold: z.coerce.number()
        .min(-5, 'Mínimo -5°C')
        .max(20, 'Máximo 20°C'),
    coldDiscountPercent: z.coerce.number()
        .min(0, 'Mínimo 0%')
        .max(100, 'Máximo 100%')
});

export type UpdatePricingData = z.infer<typeof updatePricingSchema>;