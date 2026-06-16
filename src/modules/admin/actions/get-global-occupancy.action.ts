import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError } from "@/api/errorsApi";
import type { GlobalOccupancyResponse } from "../interfaces";
import analytics from "../api/global-analytics";

export const getGlobalOccupancyStatsAction = async (year: number, month: number) : Promise<GlobalOccupancyResponse> => {
    try {
        const config = analytics.getGlobalOccupancy(year, month)
        const { data } = await clientApi.request<GlobalOccupancyResponse>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        
        throw error;
    }
}