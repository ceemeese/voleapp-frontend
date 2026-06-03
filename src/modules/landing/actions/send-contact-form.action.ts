import type { ContactForm } from "../interfaces";
import { BusinessError, ConnectionError, ValidationError } from "@/api/errorsApi";
import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import contact from "../api/contact";
import type { ProblemDetails } from "@/types/problemDetails.interface";

export const sendContactFormAction = async (dataForm : ContactForm) : Promise<void> => {
    try {
        const config = contact.sendContactFormMessage(dataForm);
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
            throw new BusinessError('Ha habido un error con el envío del formulario Intente de nuevo')
        }

        throw error;
    }
}