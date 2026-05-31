import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError, NotAuthorizedError, Forbidden } from "@/api/errorsApi";
import type { DashboardResponse } from "../../interfaces";
import analytics from "../../api/analytics";

export const getDashboardStatsAction = async (clubId: string) : Promise<DashboardResponse> => {
    try {
        const config = analytics.getDashboard(clubId);
        const { data } = await clientApi.request<DashboardResponse>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')
        
        throw error;
    }
}