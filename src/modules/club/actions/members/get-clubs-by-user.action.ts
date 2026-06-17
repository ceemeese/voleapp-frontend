import { clientApi } from "@/api/clientApi";
import type { AxiosError } from "axios";
import type { ProblemDetails } from "@/types/problemDetails.interface";
import { ConnectionError } from "@/api/errorsApi";
import member from "../../api/member";
import type { UserClubResponse, UserClub } from "../../interfaces";

export const getClubsByMemberIdAction = async (userId: string) : Promise<UserClub[]> => {
    try {
        const config = member.getClubsByMemberId(userId);
        const { data } = await clientApi.request<UserClubResponse[]>(config);
        return data.map(userClub => ({
            ...userClub,
            registeredOn: new Date(userClub.registeredOn)
        }));
    } catch (error : unknown) {
        const axiosError = error as AxiosError<ProblemDetails>;
        if (!axiosError.response) throw new ConnectionError('El servidor no responde');
        
        throw error;
    }
}