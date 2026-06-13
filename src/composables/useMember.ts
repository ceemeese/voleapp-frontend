import type { AddMember, MemberComplete, PutMember } from "@/modules/club/interfaces";
import { getMemberByIdAction, getMembersAction, registerMemberAction, updateMemberAction, deactivateMemberAction, activateMemberAction, toggleFavouriteAction } from "@/modules/club/actions/"

export const useMember = () => {

    const getMembers = (clubId : string): Promise<MemberComplete[]> => {
        return  getMembersAction(clubId);
    }


    const getMember = (clubId : string, memberId: string): Promise<MemberComplete> => {
        return getMemberByIdAction(clubId, memberId);
    }

    const addMember = (clubId : string, dataForm: AddMember) : Promise<MemberComplete> => {
        return registerMemberAction(clubId, dataForm);
    }

    const putMember = (clubId : string, memberId: string, dataForm: PutMember) : Promise<MemberComplete> => {
        return updateMemberAction(clubId, memberId, dataForm);
    }

    const deactivateMember = (clubId : string, memberId: string) : Promise<void> => {
        return deactivateMemberAction(clubId, memberId);
    }

    const activateMember = (clubId : string, memberId: string) : Promise<void> => {
        return activateMemberAction(clubId, memberId);
    }

    const toggleFavourite = async (clubId : string, memberId: string) : Promise<void> => {
        toggleFavouriteAction(clubId, memberId)
    }


    return {
        getMembers,
        getMember,
        addMember,
        putMember,
        deactivateMember,
        activateMember,
        toggleFavourite,
    }
}