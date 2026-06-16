import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";
import type { AnalyticsResponse } from "../../interfaces";
import analytics from "../../api/analytics";

export const getAnalyticsStatsAction = async (clubId: string, year: number, month: number) : Promise<AnalyticsResponse> => {
    try {
        const config = analytics.getAnalytics(clubId, year, month)
        const { data } = await clientApi.request<AnalyticsResponse>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')
        
        throw error;
    }
}