import { formatTime } from '@/helpers/dateHelpers';
import type { BaseInputProps } from 'ui';
import { z } from 'zod';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const scheduleSchema = z.object({
    dayOfWeek: z.object({
        id: z.number(),
        name: z.string()
    }).optional(),
    openingTime: z.preprocess(
        (val) => (val instanceof Date ? formatTime(val) : val),
        z.string()
         .min(1, 'La hora de apertura es obligatoria')
         .regex(timeRegex, 'El formato de hora debe ser HH:MM')
    ),
        
    closingTime: z.preprocess(
        (val) => (val instanceof Date ? formatTime(val) : val),
        z.string()
         .min(1, 'La hora de cierre es obligatoria')
         .regex(timeRegex, 'El formato de hora debe ser HH:MM')
    ),
});

export type ScheduleUpdateFormData = z.infer<typeof scheduleSchema>;
export type ScheduleAddFormData = z.infer<typeof scheduleSchema>;

export const scheduleInputsEditDialog : BaseInputProps[] = [
    { field: 'openingTime', label: 'Apertura', type: 'time', icon: 'pi pi-clock' },
    { field: 'closingTime', label: 'Cierre', type: 'time', icon: 'pi pi-clock' },
]