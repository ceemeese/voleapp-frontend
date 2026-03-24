import { z } from 'zod';

export const updateSchema = z.object({
    username: z.string().min(1, 'El apodo es obligatorio'),
    email: z.email('Introduce un email correcto'),
    phoneNumber: z
        .string()
        .min(9, 'El teléfono debe tener 9 dígitos')
        .max(9, 'El teléfono debe tener 9 dígitos')
        .regex(/^[0-9]+$/, 'El teléfono solo puede contener números'),
});

export type UpdateData = z.infer<typeof updateSchema>;