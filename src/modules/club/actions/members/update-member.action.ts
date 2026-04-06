import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import type { PutMember } from "../../interfaces";
import member from "../../api/member";


export const updateMemberAction = async (clubId: string, memberId: string, dataForm : PutMember) : Promise<void> => {
    try {
        console.log('CLUUUUB', clubId, 'MEMBERRRR', memberId)
        const config = member.putMember(clubId, memberId, dataForm);
        await clientApi.request<void>(config);
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
            throw new BusinessError('Ha habido un error en el registro. Intente de nuevo')
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

        if (status === 409) throw new BusinessError('El usuario ya es miembro de este club');

        throw error;
    }
}