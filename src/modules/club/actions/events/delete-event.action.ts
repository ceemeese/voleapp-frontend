import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";
import event from "../../api/event";

export const deleteEventAction = async (courtId: string, eventId: number) : Promise<void> => {
    try {
        const config = event.deleteEventInCourt(courtId, eventId);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        
        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status, data} = axiosError.response;

        
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