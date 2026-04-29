import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError } from "@/api/errorsApi";
import reservation from "../../api/reservation";
import type { Reservation, ReservationResponse } from "../../interfaces";


export const getUserReservationsAction = async (userId: string, startDateRange?: Date, endDateRange?: Date) : Promise<Reservation[]> => {
    try {
            const config = reservation.getUserReservations(userId, startDateRange, endDateRange);
            const { data } = await clientApi.request<ReservationResponse[]>(config);
            return data.map(reservation => ({
                ...reservation,
                date: new Date(reservation.date),
                startTime: reservation.startTime.slice(0,5),
                endTime: reservation.endTime.slice(0,5),
                createdAt: new Date(reservation.createdAt),
                updatedAt: new Date(reservation.updatedAt)
            }))
        } catch (error : unknown) {
            const axiosError = error as AxiosError<ProblemDetails>;
            if (!axiosError.response) throw new ConnectionError('El servidor no responde');
            
            const status = axiosError.response.status;
            
            if (status === 401) throw new NotAuthorizedError('Sesión expirada');
            if (status === 403) throw new Forbidden('Usuario sin permisos');
    
            throw error;
        }
}