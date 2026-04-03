import { activateClubAction, deactivateClubAction, getClubByIdAction, getClubBySearchAction, getClubsAction, registerClubAction, updateClubAction } from "@/modules/club/actions";
import type { AddClub, Club, PutClub, SummarizedClub } from "@/modules/club/interfaces";
import { ref } from "vue";

export const useClub = () => {
    const isLoading = ref(false);

    const getClubs = async (): Promise<SummarizedClub[]> => {
        isLoading.value = true;

        try {
            const data: SummarizedClub[] = await getClubsAction()
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getClubById = async (clubId: string): Promise<Club> => {
        isLoading.value = true;

        try {
            const data: Club = await getClubByIdAction(clubId)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getClubBySearch = async (name: string): Promise<SummarizedClub> => {
        isLoading.value = true;

        try {
            const data: SummarizedClub = await getClubBySearchAction(name);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const createClub = async (dataForm: AddClub): Promise<string> => {
        isLoading.value = true;

        try {
            const data: string = await registerClubAction(dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateClub = async (clubId: string, dataForm: PutClub): Promise<void> => {
        isLoading.value = true;

        try {
            await updateClubAction(clubId, dataForm);
        } finally {
            isLoading.value = false;
        }
    }

 
    const toggleStatusClub = async (club: Club): Promise<void> => {
        isLoading.value = true;

        try {
            if (club.isActive){
                await deactivateClubAction(club.id);
            } else {
                await activateClubAction(club.id);
            }

            club.isActive = !club.isActive;
        } finally {
            isLoading.value = false;
        }
    }


    return {
        getClubs,
        getClubById,
        getClubBySearch,
        createClub,
        updateClub,
        toggleStatusClub,
    }
}