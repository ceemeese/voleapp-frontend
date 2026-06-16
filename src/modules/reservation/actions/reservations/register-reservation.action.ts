import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, ValidationError, NotFoundError } from "@/api/errorsApi";
import reservation from "../../api/reservation";
import type { AddReservation, Reservation, ReservationResponse } from "../../interfaces";

export const registerReservationAction = async (dataForm: AddReservation) : Promise<Reservation> => {
    try {
        const config = reservation.createReservation(dataForm);
        const { data } = await clientApi.request<ReservationResponse>(config);
        return {
            ...data,
            date: new Date(data.date),
            startTime: data.startTime.slice(0,5),
            endTime: data.endTime.slice(0,5),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
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


        if (status === 404) {
            if (data.title.includes('CourtNotActive')) {
                throw new NotFoundError('La pista seleccionada no está activa');
            } else if (data.title.includes('CourtNotFound')) {
                throw new NotFoundError('La pista seleccionada no existe');
            } else {
                throw new NotFoundError('El club al que se está reservando no existe');
            }
        }

        throw error;
    }
}