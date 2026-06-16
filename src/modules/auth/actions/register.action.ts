import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, ValidationError } from "@/api/errorsApi";
import type { Register } from "../interfaces";
import type { User, UserResponse } from "@/modules/user/interfaces";


export const registerAction = async (dataForm : Register) : Promise<User> => {
    try {
        const config = auth.register(dataForm);
        const { data } = await clientApi.request<UserResponse>(config);
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

        if (status == 409) {
            let message = 'Ya existe un usuario con estos datos';

            if (data.title.includes('Name')) message = 'Ya existe un usuario con ese apodo';
            else if (data.title.includes('Email')) message = 'Ya existe un usuario con ese email';

            throw new BusinessError(message);
        }

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