import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError } from "@/api/errorsApi";
import club from "../../api/club";
import type { SummarizedClubResponse } from "../../interfaces";
import type { SummarizedClub } from "../../interfaces/club/club-summarized.interface";

export const getClubsAction = async () : Promise<SummarizedClub[]> => {
    try {
        const config = club.getClubs();
        const { data } = await clientApi.request<SummarizedClubResponse[]>(config);
        return data;
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        throw error;
    }
}