import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth, { type Login } from "../api/auth";
import { BusinessError, ConnectionError, NotAuthorizedError } from "@/api/errorsApi";


export const loginAction = async (credentials: Login) : Promise<LoginResponse> => {
    try {
        const config = auth.login(credentials);
        const { data } = await clientApi.request<LoginResponse>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) throw new BusinessError('Usuario o contraseña incorrectos');
        if (axiosError.response?.status === 404) throw new NotAuthorizedError('Sesión expirada');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}

export interface LoginResponse {
    token: string,
    refreshToken: string,
}