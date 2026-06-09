import { activateClubAction, deactivateClubAction, getClubByIdAction, getClubBySearchAction, getClubsAction, registerClubAction, updateClubAction } from "@/modules/club/actions";
import { getAdminContextAction } from "@/modules/club/actions/club/get-admin-context.action";
import type { AddClub, Club, PutClub, SummarizedClub } from "@/modules/club/interfaces";
import { useClubStore } from "@/stores/clubStore";
import { computed, ref } from "vue";


export const useClub = () => {
    const clubStore = useClubStore();
    const isLoading = ref<boolean>(false);
    const activeClubId = computed(() => clubStore.activeClubId);
    const currentClubInfo = computed(() => clubStore.currentClubData);

    const getAdminContext = async (targetClubId? : string): Promise<void> => {
        if (activeClubId.value === targetClubId && currentClubInfo.value) return;
        isLoading.value = true;

        try {
            const clubId : string = targetClubId || await getAdminContextAction();
            clubStore.activeClubId = clubId;

            const clubData: Club = await getClubById(clubId); 
            clubStore.currentClubData = clubData;

        } finally {
            isLoading.value = false;
        }
    }


    const getClubs = async (): Promise<Club[]> => {
        isLoading.value = true;

        try {
            const data:Club[] = await getClubsAction()
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

    const createClub = async (dataForm: AddClub): Promise<Club> => {
        isLoading.value = true;

        try {
            const data: Club = await registerClubAction(dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateClub = async (clubId: string, dataForm: PutClub): Promise<Club> => {
        isLoading.value = true;

        try {
            const data: Club = await updateClubAction(clubId, dataForm);
            return data;
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
        activeClubId,
        currentClubInfo,
        getAdminContext,
        getClubs,
        getClubById,
        getClubBySearch,
        createClub,
        updateClub,
        toggleStatusClub,
        isLoading
    }
}