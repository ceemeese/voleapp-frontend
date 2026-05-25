import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError } from "@/api/errorsApi";
import reservation from "../../api/reservation";
import type { ReservationComplete, ReservationCompleteResponse } from "../../interfaces";

export const getClubReservationsAction = async (clubId: string, startDateRange?: string, endDateRange?: string) : Promise<ReservationComplete[]> => {
    try {
            const config = reservation.getClubReservations(clubId, startDateRange, endDateRange);
            const { data } = await clientApi.request<ReservationCompleteResponse[]>(config);
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