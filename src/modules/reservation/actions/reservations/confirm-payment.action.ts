import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError } from "@/api/errorsApi";
import reservation from "../../api/reservation";

export const confirmPaymentAction = async (reservationId: number, sessionId: string): Promise<void> => {
    try {
        const config = reservation.confirmPayment(reservationId, sessionId);
        await clientApi.request(config);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}
