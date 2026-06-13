import type { BaseInputProps } from 'ui';
import { z } from 'zod';

export const passwordSchema = z
.object({
    oldPassword: z.string().min(1, 'La contraseña es obligatoria'),
    newPassword: z.string()
        .min(8, 'Debe contener entre 8 y 15 carácteres')
        .max(15, 'Debe contener entre 8 y 15 carácteres')
        .regex(/[A-Z]/, 'Debe contener una letra mayúscula')
        .regex(/[a-z]/, 'Debe contener una letra minúscula')
        .regex(/[0-9]/, 'Debe contener un dígito'),
    confirmPassword: z.string().min(1, 'La confirmación es obligatoria')
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type UpdatePasswordData = z.infer<typeof passwordSchema>;


export const passwordInputs : BaseInputProps[] = [
    { field: 'oldPassword', label: 'Contraseña actual', icon: 'pi pi-lock', type: 'password' },
    { field: 'newPassword', label: 'Nueva contraseña', icon: 'pi pi-lock', type: 'password' },
    { field: 'confirmPassword', label: 'Confirma contraseña', icon: 'pi pi-lock', type: 'password' },
];