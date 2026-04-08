import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import type { AddSchedule, Schedule, ScheduleResponse } from "../../interfaces";
import schedule from "../../api/schedule";


export const registerScheduleAction = async (clubId: string, dataForm : AddSchedule) : Promise<Schedule> => {
    try {
        const config = schedule.registerScheduleByClub(clubId, dataForm);
        const { data } = await clientApi.request<ScheduleResponse>(config);
        return {
            ...data,
            openingTime: new Date(data.openingTime),
            closingTime: new Date(data.openingTime),
        }
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

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')
        if (status === 409) throw new BusinessError('Ya existe un horario para el día solicitado');

        throw error;
    }
}