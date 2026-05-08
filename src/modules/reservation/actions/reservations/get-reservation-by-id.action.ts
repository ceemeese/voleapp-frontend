import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import reservation from "../../api/reservation";
import type { Reservation, ReservationResponse } from "../../interfaces";


export const getReservationByIdAction = async (reservationId: number) : Promise<Reservation> => {
    try {
            const config = reservation.getReservationById(reservationId);
            const { data } = await clientApi.request<ReservationResponse>(config);
            return {
                ...data,
                date: new Date(data.date),
                startTime: data.startTime.slice(0,5),
                endTime: data.endTime.slice(0,5),
                createdAt : new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
            }
        } catch (error : unknown) {
            const axiosError = error as AxiosError<ProblemDetails>;
            if (!axiosError.response) throw new ConnectionError('El servidor no responde');
            
            const status = axiosError.response.status;
            
            if (status === 401) throw new NotAuthorizedError('Sesión expirada');
            if (status === 403) throw new Forbidden('Usuario sin permisos');
            if (status === 404) throw new NotFoundError('La reserva solicitada no existe o no está disponible');
    
            throw error;
        }
}