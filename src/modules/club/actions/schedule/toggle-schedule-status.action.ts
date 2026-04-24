import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import schedule from "../../api/schedule";


export const toggleScheduleStatusAction = async (clubId: string, scheduleId: number) : Promise<void> => {
    try {
        const config = schedule.toggleScheduleState(clubId, scheduleId);
        await clientApi.request<void>(config);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status, data} = axiosError.response;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        if (status === 404) {
            const isNotFoundClubError = data.title.includes('Club');

            if (isNotFoundClubError) {
                throw new NotFoundError('El club solicitado no existe o no está disponible')
            }

            throw new NotFoundError('El horario que buscas no está en el club');
        }

        throw error;
    }
}