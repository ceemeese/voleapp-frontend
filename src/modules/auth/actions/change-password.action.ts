import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { BusinessError, ConnectionError, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import type { ChangePassword } from "../interfaces";


export const changePasswordAction = async (passwords: ChangePassword) : Promise<void> => {
    try {
        const config = auth.putPasswordConfig(passwords);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (axiosError.response?.status === 400) throw new BusinessError('Usuario o contraseña incorrectos');
        if (axiosError.response?.status === 403) throw new NotAuthorizedError('Sesión expirada');
        if (axiosError.response?.status === 404) throw new NotFoundError('No se ha podido procesar el cambio de contraseña, intenta de nuevo');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}