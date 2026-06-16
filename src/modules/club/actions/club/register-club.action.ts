import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, ValidationError } from "@/api/errorsApi";
import type { AddClub, Club, ClubResponse } from "../../interfaces";
import club from "../../api/club";


export const registerClubAction = async (dataForm : AddClub) : Promise<Club> => {
    try {
        const config = club.registerClub(dataForm);
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


        throw error;
    }
}