import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { BusinessError, ConnectionError, NotAuthorizedError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import type { LoginResponse, Login } from "../interfaces";


export const loginAction = async (credentials: Login) : Promise<LoginResponse> => {
    try {
        const config = auth.login(credentials);
        const { data } = await clientApi.request<LoginResponse>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (axiosError.response?.status === 400) throw new BusinessError('Usuario o contraseña incorrectos');
        if (axiosError.response?.status === 404) throw new NotAuthorizedError('Sesión expirada');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}