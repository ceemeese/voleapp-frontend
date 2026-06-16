import user from "../api/user"
import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";

export const activateUserAction = async (id: string) : Promise<void> => {
    try {
        const config = user.activateUser(id);
        await clientApi.request<void>(config);
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 400) throw new NotAuthorizedError('No se puede realizar esta acción');
        if (status === 404) throw new NotFoundError('Usuario no encontrado');
        
        throw error;
    }
}