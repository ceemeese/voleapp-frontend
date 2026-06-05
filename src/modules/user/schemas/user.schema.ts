import type { BaseInputProps } from 'ui';
import { z } from 'zod';

export const userSchema = z.object({
    username: z.string().min(1, 'El apodo es obligatorio'),
    email: z.email('Introduce un email correcto'),
    phoneNumber: z
        .string()
        .min(9, 'El teléfono debe tener 9 dígitos')
        .max(9, 'El teléfono debe tener 9 dígitos')
        .regex(/^[0-9]+$/, 'El teléfono solo puede contener números'),
});

export type UpdateUserData = z.infer<typeof userSchema>;

export const userInputsEditDialog : BaseInputProps[] = [
    { field: 'username', label: 'Apodo', icon: 'pi pi-user' },
    { field: 'email', label: 'Email', icon: 'pi pi-envelope', type: 'email' },
    { field: 'phoneNumber', label: 'Teléfono', icon: 'pi pi-phone' },
]