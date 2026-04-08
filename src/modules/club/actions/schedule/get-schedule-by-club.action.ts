import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import schedule from "../../api/schedule";
import type { Schedule, ScheduleResponse } from "../../interfaces";

export const getScheduleByIdClubAction = async (clubId: string) : Promise<Schedule[]> => {
    try {
        const config = schedule.getScheduleByClub(clubId);
        const { data } = await clientApi.request<ScheduleResponse[]>(config);
        return data.map(schedule => ({
                ...schedule,
                openingTime: new Date(schedule.openingTime),
                closingTime: new Date(schedule.closingTime)
            }))
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