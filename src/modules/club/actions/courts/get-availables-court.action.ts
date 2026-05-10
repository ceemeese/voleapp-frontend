
import court from "../../api/court";
import { AxiosError } from "axios";
import { clientApi } from "@/api/clientApi";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError, Forbidden, NotAuthorizedError, ValidationError } from "@/api/errorsApi";
import type { CourtGroupedResponse } from "../../interfaces";
import { toDateOnlyString, formatTime } from "@/helpers/dateHelpers";

export const getAvailableCourtsAction = async (city: string, dateFilter: Date, durationMinutes: number ) : Promise<CourtGroupedResponse[]> => {
    try {
        const datePart = toDateOnlyString(dateFilter);
        const timePart = formatTime(dateFilter);
        const manualUtcString = `${datePart}T${timePart}:00.000Z`;

        const config = court.availabilityCourt(city, manualUtcString, durationMinutes);
        const { data } = await clientApi.request<CourtGroupedResponse[]>(config);
        return data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        
        if (!axiosError.response) {
            throw new ConnectionError('El servidor no responde');            
        }

        const {status, data} = axiosError.response;


        if (status == 400) {
            const isValidationError = data.title.includes('Validation');

            if (isValidationError) {
                throw new ValidationError('Los datos introducidos no son válidos. Por favor, revísalos')
            }
        }

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');

        throw error;
    }
}