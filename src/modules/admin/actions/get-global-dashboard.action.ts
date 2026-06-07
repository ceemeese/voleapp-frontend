import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotAuthorizedError, Forbidden } from "@/api/errorsApi";
import type { GlobalDashboardResponse } from "../interfaces";
import analytics from "../api/global-analytics";

export const getGlobalDashboardStatsAction = async () : Promise<GlobalDashboardResponse> => {
    try {
        const config = analytics.getGlobalDashboard()
        const { data } = await clientApi.request<GlobalDashboardResponse>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        throw error;
    }
}