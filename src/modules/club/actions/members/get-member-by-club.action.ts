import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import member from "../../api/member";
import type { MemberResponse, MemberComplete } from "../../interfaces";

export const getMemberByIdAction = async (clubId: string, memberId: string) : Promise<MemberComplete> => {
    try {
        const config = member.getMemberDetail(clubId, memberId);
        const { data } = await clientApi.request<MemberResponse>(config);
        return {
            ...data,
            registeredOn: new Date(data.registeredOn)
        };
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;

        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const { status, data }  = axiosError.response;

        if (status == 400) {
            const isValidationError = data.title.includes('Validation');

            if (isValidationError) {
                throw new ValidationError('Los datos introducidos no son válidos. Por favor, revísalos')
            }
            throw new BusinessError('Ha habido un error en la obtención de datos. Intente de nuevo')
        }

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        if (status === 404) {
            const isNotFoundClubError = data.title.includes('Club');

            if (isNotFoundClubError) {
                throw new NotFoundError('El club solicitado no existe o no está disponible')
            }

            throw new NotFoundError('El usuario que buscas no pertenece a este club');
        }

        

        throw error;
    }
}