import { z } from 'zod';

export const resetSchema = z
.object({
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