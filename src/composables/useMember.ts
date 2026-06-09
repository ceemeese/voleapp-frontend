
import { ref } from "vue";
import type { AddMember, MemberComplete, PutMember } from "@/modules/club/interfaces";
import { getMemberByIdAction, getMembersAction, registerMemberAction, updateMemberAction, deactivateMemberAction, activateMemberAction, toggleFavouriteAction } from "@/modules/club/actions/"

export const useMember = () => {
    const isLoading = ref<boolean>(false);

    const getMembers = async (clubId : string): Promise<MemberComplete[]> => {
        isLoading.value = true;

        try {
            const data: MemberComplete[] = await getMembersAction(clubId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    const getMember = async (clubId : string, memberId: string): Promise<MemberComplete> => {
        isLoading.value = true;

        try {
            const data: MemberComplete = await getMemberByIdAction(clubId, memberId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const addMember = async (clubId : string, dataForm: AddMember) : Promise<MemberComplete> => {
        isLoading.value = true;

        try {
            const data: MemberComplete = await registerMemberAction(clubId, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const putMember = async (clubId : string, memberId: string, dataForm: PutMember) : Promise<MemberComplete> => {
        isLoading.value = true;

        try {
            const data: MemberComplete = await updateMemberAction(clubId, memberId, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const deactivateMember = async (clubId : string, memberId: string) : Promise<void> => {
        isLoading.value = true;

        try {
            await deactivateMemberAction(clubId, memberId);
        } finally {
            isLoading.value = false;
        }
    }

    const activateMember = async (clubId : string, memberId: string) : Promise<void> => {
        isLoading.value = true;

        try {
            await activateMemberAction(clubId, memberId);
        } finally {
            isLoading.value = false;
        }
    }

    const toggleFavourite = async (clubId : string, memberId: string) : Promise<void> => {
        isLoading.value = true;

        try {
            await toggleFavouriteAction(clubId, memberId)
        } finally {
            isLoading.value = false;
        }
    }


    return {
        isLoading,
        getMembers,
        getMember,
        addMember,
        putMember,
        deactivateMember,
        activateMember,
        toggleFavourite,
    }
}