import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";
import club from "../../api/club";
import type { Club, ClubResponse } from "../../interfaces";

export const getClubByIdAction = async (clubId: string) : Promise<Club> => {
    try {
        const config = club.getClubById(clubId);
        const { data } = await clientApi.request<ClubResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        const status = axiosError.response?.status;

        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        throw error;
    }
}