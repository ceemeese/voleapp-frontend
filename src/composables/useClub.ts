import { activateClubAction, deactivateClubAction, getClubByIdAction, getClubBySearchAction, getClubsAction, registerClubAction, updateClubAction } from "@/modules/club/actions";
import { getAdminContextAction } from "@/modules/club/actions/club/get-admin-context.action";
import type { AddClub, Club, PutClub, SummarizedClub } from "@/modules/club/interfaces";


export const useClub = () => {
    const clubStore = useClubStore();
    const activeClubId = computed(() => clubStore.activeClubId);
    const currentClubInfo = computed(() => clubStore.currentClubData);

    const getAdminContext = async (targetClubId? : string): Promise<void> => {
        if (activeClubId.value === targetClubId && currentClubInfo.value) return;

        const clubId : string = targetClubId || await getAdminContextAction();
        clubStore.activeClubId = clubId;

        const clubData: Club = await getClubById(clubId); 
        clubStore.currentClubData = clubData;
    }


    const getClubs = (): Promise<Club[]> => {
        return getClubsAction()
    }

    const getClubById = (clubId: string): Promise<Club> => {
        return getClubByIdAction(clubId);
    }

    const getClubBySearch = (name: string): Promise<SummarizedClub> => {
        return getClubBySearchAction(name);
    }

    const createClub = (dataForm: AddClub): Promise<Club> => {
        return registerClubAction(dataForm);
    }

    const updateClub = (clubId: string, dataForm: PutClub): Promise<Club> => {
        return updateClubAction(clubId, dataForm);
    }

 
    const toggleStatusClub = async (club: Club): Promise<void> => {
        if (club.isActive){
            await deactivateClubAction(club.id);
        } else {
            await activateClubAction(club.id);
        }

        club.isActive = !club.isActive;
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
    }
}