import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, NotFoundError, ValidationError } from "@/api/errorsApi";
import type { PutSchedule, Schedule, ScheduleResponse } from "../../interfaces";
import schedule from "../../api/schedule";


export const putScheduleAction = async (clubId: string, scheduleId: number, dataForm : PutSchedule) : Promise<Schedule> => {
    try {
        const config = schedule.putScheduleByClub(clubId, scheduleId, dataForm);
        const { data } = await clientApi.request<ScheduleResponse>(config);
        return data;

    } catch (error: unknown) {
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