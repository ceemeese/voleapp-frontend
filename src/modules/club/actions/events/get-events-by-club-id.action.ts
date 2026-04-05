import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import event from "../../api/event";
import type { EventResponse, Event } from "../../interfaces";

export const getEventsRangeByClubAction = async (clubId: string, startRange: Date, endRange?: Date) : Promise<Event[]> => {
    try {
        const config = event.getEventsRangeByClub(clubId, startRange, endRange);
        const { data } = await clientApi.request<EventResponse[]>(config);
        return data.map(event => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
            createdAt: new Date(event.createdAt),
        }));
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        
        const status = axiosError.response.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')

        throw error;
    }
}