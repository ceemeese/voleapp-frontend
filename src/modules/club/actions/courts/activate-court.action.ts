import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, NotFoundError, ValidationError } from "@/api/errorsApi";
import court from "../../api/court";


export const activateCourtAction = async (courtId: string) : Promise<void> => {
    try {
        const config = court.activateCourt(courtId);
        await clientApi.request<void>(config);
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
            throw new BusinessError('Ha habido un error en la activación de la pista. Intente de nuevo')
        }

        if (status === 404) throw new NotFoundError('La pista solicitada no existe o no está disponible')

        throw error;
    }
}