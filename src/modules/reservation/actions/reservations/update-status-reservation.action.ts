import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, NotFoundError } from "@/api/errorsApi";
import reservation from "../../api/reservation";


export const updateStatusReservationAction = async (reservationId: number, newStatus: number) : Promise<void> => {
    try {
        const config = reservation.updateStatusReservation(reservationId, newStatus);
        await clientApi.request<void>(config);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status, data} = axiosError.response;
        const errorCode = data.title;

        if (status === 404) throw new NotFoundError('La reserva solicitada no existe o no está disponible')

        if (status === 409) {
            if (errorCode === 'AlreadyFinalized') {
                throw new BusinessError('No se puede modificar una reserva que ya ha sido finalizada');
            }
            if (errorCode === 'CannotMoveBackToPending') {
                throw new BusinessError('Una reserva confirmada no puede volver al estado pendiente');
            }
        }

        throw error;
    }
}