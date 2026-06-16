import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError } from "@/api/errorsApi";
import type { GlobalAnalyticsResponse } from "../interfaces";
import analytics from "../api/global-analytics";

export const getGlobalAnalyticsStatsAction = async (year: number, month: number) : Promise<GlobalAnalyticsResponse> => {
    try {
        const config = analytics.getGlobalAnalytics(year, month)
        const { data } = await clientApi.request<GlobalAnalyticsResponse>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        
        throw error;
    }
}