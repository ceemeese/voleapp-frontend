import { z } from 'zod';


const timeSchema = z.union([
  z.string(),
  z.date()
]).transform((val) => {
  if (val instanceof Date) {
    return val.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  }
  return val;
}).pipe(
  z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Hora inválida")
);

export const addEventSchema = z.object({
    courtId:z.string().min(1, 'La pista es obligatoria'),
    date: z.date().min(new Date(new Date().setHours(0,0,0,0)), 'La fecha no puede ser anterior a hoy'),
    startTime: timeSchema,
    endTime: timeSchema,
    eventName: z.string().min(1, 'El nombre es obligatorio'),
    description: z.string().optional(),
}).refine(data => data.endTime > data.startTime, {
    message: 'La hora de fin debe ser posterior a la de inicio',
    path: ['endTime']
});

export type CourtAddFormData = z.infer<typeof addEventSchema>;