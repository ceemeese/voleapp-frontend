import { activateCourtAction, deactivateCourtAction, getCourtByIdAction, getCourtsAction, getCourtsByClubIdAction, registerCourtAction, updateCourtAction } from "@/modules/club/actions";
import { getAvailableCourtsAction } from "@/modules/club/actions/courts/get-availables-court.action";
import type { AddCourt, Court, CourtGroupedResponse, PutCourt } from "@/modules/club/interfaces";
import { ref, computed } from "vue";
import { useClubStore } from "@/stores/clubStore";

export const useCourt = () => {
    const clubStore = useClubStore();
    const isLoading = ref<boolean>(false);
    const courts = computed(() => clubStore.courts);

    const getAllCourts = async (): Promise<Court[]> => {

        try {
            const data: Court[] = await getCourtsAction();
            clubStore.courts = data;
            return data;
        } finally {

        }
    }

    const getCourtsByClubId = async (clubId: string): Promise<Court[]> => {

        try {
            const data: Court[] = await getCourtsByClubIdAction(clubId);
            clubStore.courts = data;
            return data;
        } finally {
            
        }
    }

    const getCourtById = async (courtId: string): Promise<Court> => {

        try {
            const data: Court = await getCourtByIdAction(courtId);
            return data;
        } finally {
            
        }
    }

    const searchAvailability = async (city: string, dateFilter: Date, durationMinutes: number): Promise<CourtGroupedResponse[]> => {

        try {
            const data = await getAvailableCourtsAction(city, dateFilter, durationMinutes);
            return data;
        } finally {
            
        }
    }

    const registerCourt = async (clubId: string, dataForm: AddCourt): Promise<Court> => {

        try {
            const data: Court = await registerCourtAction(clubId, dataForm)
            clubStore.courts = [data, ...clubStore.courts]
            return data;
        } finally {
            
        }
    }

    const updateCourt = async (courtId: string, dataForm: PutCourt): Promise<Court> => {

        try {
            const data: Court = await updateCourtAction(courtId, dataForm);
            clubStore.courts = clubStore.courts.map(court => 
                court.id === courtId
                ? data
                : court
            );

            return data;
        } finally {
            
        }
    }

    const deactivateCourt = async (courtId: string): Promise<void> => {

        try {
            await deactivateCourtAction(courtId);
            clubStore.courts = clubStore.courts.map(court =>
                court.id === courtId
                ? { ...court, isActive: false }
                : court
            );
        } finally {
            
        }
    }

    const activateCourt = async (courtId: string): Promise<void> => {
        

        try {
            await activateCourtAction(courtId);
            clubStore.courts = clubStore.courts.map(court =>
                court.id === courtId
                ? { ...court, isActive: true }
                : court
            );
        } finally {
            
        }
    }

    return {
        getAllCourts,
        getCourtsByClubId,
        getCourtById,
        searchAvailability,
        registerCourt,
        updateCourt,
        deactivateCourt,
        activateCourt,
        courts,
        isLoading
    }
}