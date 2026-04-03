import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, ValidationError } from "@/api/errorsApi";
import type { AddClub } from "../../interfaces";
import club from "../../api/club";


export const registerClubAction = async (dataForm : AddClub) : Promise<string> => {
    try {
        const config = club.registerClub(dataForm);
        const { data } = await clientApi.request<string>(config);
        return data;
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

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');

        throw error;
    }
}