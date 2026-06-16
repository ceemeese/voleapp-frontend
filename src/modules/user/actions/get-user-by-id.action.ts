import type { User, UserResponse } from "../interfaces"
import user from "../api/user"
import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, NotFoundError } from "@/api/errorsApi";

export const getUserByIdAction = async (id: string) : Promise<User> => {
    try {
        const config = user.getUserById(id);
        const { data } = await clientApi.request<UserResponse>(config);
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;
        
        if (status === 404) throw new NotFoundError('Usuario no encontrado');
        
        throw error;
    }
}