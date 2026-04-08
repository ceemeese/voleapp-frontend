import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import event from "../../api/event";
import type { Event, EventResponse, PutEvent } from "../../interfaces";

export const updateEventAction = async (courtId: string, eventId: number, dataForm: PutEvent) : Promise<Event> => {
    try {
        const config = event.updateEventInCourt(courtId, eventId, dataForm);
        const { data } = await clientApi.request<EventResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        
        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status, data} = axiosError.response;

        if (status == 400) {
            const isValidationError = data.title.includes('Validation');

            if (isValidationError) {
                throw new ValidationError('Los datos introducidos no son válidos. Por favor, revísalos')
            }
            throw new BusinessError('Ha habido un error en el registro. Intente de nuevo')
        }

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        if (status === 404) {
            const isNotFoundCourtError = data.title.includes('Court');

            if (isNotFoundCourtError) {
                throw new NotFoundError('La pista solicitada no existe o no está disponible')
            }

            throw new NotFoundError('El evento que buscas no pertenece a esta pista');
        }

        throw error;
    }
}