import type { BaseInputProps } from 'ui';
import { z } from 'zod';

export const forgotSchema = z.object({
    email: z.email('Introduce un email correcto'),
});

export const forgotInputDialog : BaseInputProps[] = [
    { field: 'email', label: 'Email', icon: 'pi pi-envelope', type: 'email' },
]