import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, NotFoundError } from "@/api/errorsApi";
import reservation from "../../api/reservation";


export const cancelReservationAction = async (reservationId: number) : Promise<void> => {
    try {
        const config = reservation.cancelReservation(reservationId);
        await clientApi.request<void>(config);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status} = axiosError.response;

        if (status === 404) throw new NotFoundError('La reserva solicitada no existe o no está disponible')
        if (status === 409) throw new BusinessError('La reserva ya no admite cambios de estado')
            
        throw error;
    }
}