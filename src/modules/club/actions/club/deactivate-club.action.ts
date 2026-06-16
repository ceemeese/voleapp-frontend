import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";
import club from "../../api/club";


export const deactivateClubAction = async (clubId: string) : Promise<void> => {
    try {
        const config = club.deactivateClub(clubId);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status} = axiosError.response;

        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')

        throw error;
    }
}