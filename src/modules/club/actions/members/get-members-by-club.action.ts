import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails";
import { ConnectionError, Forbidden, NotAuthorizedError, NotFoundError } from "@/api/errorsApi";
import member from "../../api/member";
import type { MemberResponse, Member } from "../../interfaces";

export const getMembersAction = async (clubId: string) : Promise<Member[]> => {
    try {
        const config = member.getMembersByClub(clubId);
        const { data } = await clientApi.request<MemberResponse[]>(config);
        return data.map(member => ({
            ...member,
            registeredOn: new Date(member.registeredOn)
        }));
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');

        const status = axiosError.response.status;

        if (status === 401) throw new NotAuthorizedError('Sesión expirada');
        if (status === 404) throw new NotFoundError('El club solicitado no existe o no está disponible')
        if (status === 403) throw new Forbidden('Usuario sin permisos');
        
        throw error;
    }
}