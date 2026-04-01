import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
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
        const status = axiosError.response?.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('La pista solicitada no existe o no está disponible')
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        throw error;
    }
}