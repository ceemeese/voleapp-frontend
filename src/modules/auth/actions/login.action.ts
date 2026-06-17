import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { BusinessError, ConnectionError, NotFoundError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import type { LoginResponse, Login } from "../interfaces";


export const loginAction = async (credentials: Login) : Promise<LoginResponse> => {
    try {
        const config = auth.login(credentials);
        const { data } = await clientApi.request<LoginResponse>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (axiosError.response?.status === 400) {
            const title = axiosError.response.data?.title;
            if (title === 'IdentityUser.EmailNotConfirmed') {
                throw new BusinessError('Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada');
            }
            throw new BusinessError('Usuario o contraseña incorrectos');
        }

        if (axiosError.response?.status === 404) throw new NotFoundError('Usuario o contraseña incorrectos');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}