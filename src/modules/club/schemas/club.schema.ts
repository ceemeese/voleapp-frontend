import { z } from 'zod';
import { COUNTRY_FLAGS_DATA } from '@/utils/country-utils';
import type { BaseInputProps } from 'ui';

export const clubSchema = z.object({
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

export type ClubUpdateFormData = z.infer<typeof clubSchema>;
export type ClubAddFormData = z.infer<typeof clubSchema>;


export const clubInputsDialog : BaseInputProps[] = [
    { field: 'name', label: 'Nombre del club', icon: 'pi pi-shop'},
    { field: 'cif', label: 'CIF', icon: 'pi pi-id-card'},
    { field: 'street', label: 'Dirección', icon: 'pi pi-address-book'},
    { field: 'city', label: 'Ciudad', icon: 'pi pi-address-book' },
    { field: 'zipCode', label: 'Código postal', icon: 'pi pi-address-book' },
    { field: 'country', label: 'País', type: 'select', options: Object.entries(COUNTRY_FLAGS_DATA).map(([code, data]) => ({
        code,
        label: `${data.flag} ${data.name}`
    })), optionLabel: 'label' , optionValue: 'code'},
    { field: 'phoneNumber', label: 'Teléfono', icon: 'pi pi-phone' },
    { field: 'email', label: 'Email', icon: 'pi pi-envelope', type: 'email' },
]