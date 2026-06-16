import user from "../api/user"
import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import type { PutUser, User, UserResponse } from "../interfaces";

export const updateUserAction = async (id: string, dataForm: PutUser) : Promise<User> => {
    try {
        const config = user.putUser(id, dataForm );
        const { data } = await clientApi.request<UserResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const { status, data }  = axiosError.response;

        if (status === 400) {
            const isValidationError = data.title.includes('Validation');

            if (isValidationError) {
                throw new ValidationError('Los datos introducidos no son válidos. Por favor, revísalos')
            }
            //salta si intentan actualiar admin
            throw new NotAuthorizedError('No se puede realizar esta acción');
        }
                       
        if (status === 404) throw new NotFoundError('Usuario no encontrado');
        
        throw error;
    }
}