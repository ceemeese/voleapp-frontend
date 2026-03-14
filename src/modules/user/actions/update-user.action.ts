import user from "../api/user"
import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import type { PutUser } from "../interfaces";

export const updateUserAction = async (id: string, data: PutUser) : Promise<void> => {
    try {
        const config = user.putUser(id, data );
        await clientApi.request<void>(config);
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        const status = axiosError.response?.status;

        if (status === 400) throw new NotAuthorizedError('No se puede realizar esta acción');
        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('Usuario no encontrado');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        
        throw error;
    }
}