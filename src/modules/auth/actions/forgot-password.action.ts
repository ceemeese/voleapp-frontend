import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { BusinessError, ConnectionError, NotFoundError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import type { ForgotPassword } from "../interfaces/forgot-password.interface";


export const forgotPasswordAction = async (dataForgot: ForgotPassword) : Promise<void> => {
    try {
        const config = auth.forgotPasswordConfig(dataForgot);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (axiosError.response?.status === 400) throw new BusinessError('Usuario o contraseña incorrectos');
        if (axiosError.response?.status === 404) throw new NotFoundError('No se ha podido procesar el envío de correo, intenta de nuevo');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}