import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { BusinessError, ConnectionError, NotFoundError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import type { ConfirmEmail } from "../interfaces";


export const confirmEmailAction = async (dataConfirm: ConfirmEmail) : Promise<void> => {
    try {
        const config = auth.confirmEmailConfig(dataConfirm);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error: unknown ) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (axiosError.response?.status === 400) throw new BusinessError('El enlace de confirmación no es válido o ha expirado');
        if (axiosError.response?.status === 404) throw new NotFoundError('El enlace de confirmación no es válido o ha expirado');
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}