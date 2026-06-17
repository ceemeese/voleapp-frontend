import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import auth from "../api/auth";
import { ConnectionError } from "@/api/errorsApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";


export const resendConfirmationAction = async (email: string): Promise<void> => {
    try {
        const config = auth.resendConfirmationConfig(email);
        const { data } = await clientApi.request<void>(config);
        return data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        throw error;
    }
}
