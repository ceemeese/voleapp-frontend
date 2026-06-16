import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { BusinessError, ConnectionError, NotFoundError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import type { ResetPassword } from "../interfaces";


export const resetPasswordAction = async (credentials: ResetPassword) : Promise<void> => {
    try {
        const config = auth.resetPasswordConfig(credentials);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (axiosError.response?.status === 400) throw new BusinessError('Usuario o contraseña incorrectos');
        if (axiosError.response?.status === 404) throw new NotFoundError('No se ha podido procesar el cambio de contraseña, intenta de nuevo');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}