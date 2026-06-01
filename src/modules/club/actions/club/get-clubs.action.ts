import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError } from "@/api/errorsApi";
import club from "../../api/club";
import type { Club, ClubResponse } from "../../interfaces";

export const getClubsAction = async () : Promise<Club[]> => {
    try {
        const config = club.getClubs();
        const { data } = await clientApi.request<ClubResponse[]>(config);
        return data.map(club => ({
            ...club,
            createdAt: new Date(club.createdAt)
        }));
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        throw error;
    }
}