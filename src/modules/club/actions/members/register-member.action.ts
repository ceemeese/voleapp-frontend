import { clientApi } from "@/api/clientApi";
import { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { BusinessError, ConnectionError, Forbidden, NotAuthorizedError, NotFoundError, ValidationError } from "@/api/errorsApi";
import type { AddMember } from "../../interfaces";
import member from "../../api/member";


export const registerMemberAction = async (clubId: string, dataForm : AddMember) : Promise<string> => {
    try {
        const config = member.registerMember(clubId, dataForm);
        const { data } = await clientApi.request<string>(config);
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
            throw new BusinessError('Ha habido un error en el registro. Intente de nuevo')
        }

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')

        if (status === 409) throw new BusinessError('El usuario ya es miembro de este club');

        throw error;
    }
}