import type { User, UserResponse } from "../interfaces"
import user from "../api/user"
import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError } from "@/api/errorsApi";

export const getUsersAction = async () : Promise<User[]> => {
    try {
        const config = user.getUsers();
        const { data } = await clientApi.request<UserResponse[]>(config);
        return data.map(user => ({
                ...user,
                createdAt: new Date(user.createdAt),
            }))
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        throw error;
    }
}