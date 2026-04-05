import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError } from "@/api/errorsApi";
import court from "../../api/court";
import type { Court, CourtResponse } from "../../interfaces";

export const getCourtsAction = async () : Promise<Court[]> => {
    try {
        const config = court.getAllCourts()
        const { data } = await clientApi.request<CourtResponse[]>(config);
        return data.map(court => ({
            ...court,
            createdAt: new Date(court.createdAt)
        }));
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        
        const status = axiosError.response.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        throw error;
    }
}