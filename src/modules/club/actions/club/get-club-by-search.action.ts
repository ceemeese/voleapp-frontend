import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";
import club from "../../api/club";
import type { SummarizedClub, SummarizedClubResponse } from "../../interfaces";

export const getClubBySearchAction = async (clubId: string) : Promise<SummarizedClub> => {
    try {
        const config = club.getClubById(clubId);
        const { data } = await clientApi.request<SummarizedClubResponse>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        
        const status = axiosError.response.status;

        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')
        

        throw error;
    }
}