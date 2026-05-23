import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import type { PricingConfig, PricingConfigResponse, PutPricingConfig } from "../../interfaces";
import pricing from "../../api/pricing";


export const updatePricingConfigAction = async (clubId: string, dataForm : PutPricingConfig) : Promise<PricingConfig> => {
    try {
        const config = pricing.putPricingConfig(clubId, dataForm);
        const { data } = await clientApi.request<PricingConfigResponse>(config);
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
                throw new ValidationError('Los porcentajes introducidos no son válidos. Por favor, revísalos')
            }
            throw new BusinessError('Ha habido un error en la modificación. Intente de nuevo')
        }

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('La pista solicitada no existe o no está disponible')

        throw error;
    }
}