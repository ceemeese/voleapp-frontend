import type { User, UserResponse } from "../interfaces"
import user from "../api/user"
import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";

export const getUserByEmailAction = async (email: string) : Promise<User> => {
    try {
        const config = user.getUserByEmail(email);
        const { data } = await clientApi.request<UserResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        const status = axiosError.response?.status;
        
        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('No existe usuario con ese email');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        
        throw error;
    }
}