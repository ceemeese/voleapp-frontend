import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, NotFoundError, ValidationError } from "@/api/errorsApi";
import club from "../../api/club";
import type { Club, ClubResponse, PutClub } from "../../interfaces";


export const updateClubAction = async (clubId: string, dataForm : PutClub) : Promise<Club> => {
    try {
        const config = club.putClub(clubId, dataForm);
        const { data } = await clientApi.request<ClubResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status, data} = axiosError.response;


        if (status == 400) {
            const isValidationError = data.title.includes('Validation');

            if (isValidationError) {
                throw new ValidationError('Los datos introducidos no son válidos. Por favor, revísalos')
            }
            throw new BusinessError('Ha habido un error en el registro. Intente de nuevo')
        }

        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')

        throw error;
    }
}