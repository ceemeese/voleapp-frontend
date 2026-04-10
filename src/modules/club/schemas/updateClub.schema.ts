import { z } from 'zod';

export const updateClubSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    cif: z.string().min(9, 'El número debe tener 9 dígitos').max(9, 'El número debe tener 9 dígitos'),
    street: z.string().min(1, 'La calle es obligatoria'),
    city: z.string().min(1, 'La ciudad es obligatoria'),
    zipCode: z.string().min(1, 'El código postal es obligatorio').max(5, 'El código postal no puede tener más de 5 dígitos'),
    country: z.string().min(1, 'El país postal es obligatorio'),
    email: z.email('Introduce un email correcto'),
    phoneNumber: z
        .string()
        .min(9, 'El teléfono debe tener 9 dígitos')
        .max(9, 'El teléfono debe tener 9 dígitos')
        .regex(/^[0-9]+$/, 'El teléfono solo puede contener números'),
});

export type UpdateClubData = z.infer<typeof updateClubSchema>;