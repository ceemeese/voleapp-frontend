import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import event from "../../api/event";
import type { EventResponse, Event } from "../../interfaces";

export const getEventByIdAction = async (courtId: string, eventId: number) : Promise<Event> => {
    try {
        const config = event.getEventById(courtId, eventId);
        const { data } = await clientApi.request<EventResponse>(config);
        return {
            ...data,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            createdAt: new Date(data.createdAt),
        }
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        const { status, data }  = axiosError.response;

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