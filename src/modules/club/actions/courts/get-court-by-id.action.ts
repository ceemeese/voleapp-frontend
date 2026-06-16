import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";
import court from "../../api/court";
import type { Court, CourtResponse } from "../../interfaces";

export const getCourtByIdAction = async (courtId: string) : Promise<Court> => {
    try {
        const config = court.getCourtById(courtId)
        const { data } = await clientApi.request<CourtResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        };
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 404) throw new NotFoundError('La pista solicitada no existe o no está disponible')
        
        throw error;
    }
}