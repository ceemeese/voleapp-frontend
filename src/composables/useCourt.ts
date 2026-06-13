import { activateCourtAction, deactivateCourtAction, getCourtByIdAction, getCourtsAction, getCourtsByClubIdAction, registerCourtAction, updateCourtAction } from "@/modules/club/actions";
import { getAvailableCourtsAction } from "@/modules/club/actions/courts/get-availables-court.action";
import type { AddCourt, Court, CourtGroupedResponse, PutCourt } from "@/modules/club/interfaces";


export const useCourt = () => {
    const clubStore = useClubStore();
    const courts = computed(() => clubStore.courts);

    const getAllCourts = async (): Promise<Court[]> => {
        const data: Court[] = await getCourtsAction();
        clubStore.courts = data;
        return data;
    }

    const getCourtsByClubId = async (clubId: string): Promise<Court[]> => {
        const data: Court[] = await getCourtsByClubIdAction(clubId);
        clubStore.courts = data;
        return data;
    }

    const getCourtById = (courtId: string): Promise<Court> => {
        return getCourtByIdAction(courtId);
    }

    const searchAvailability = (city: string, dateFilter: Date, durationMinutes: number): Promise<CourtGroupedResponse[]> => {
        return getAvailableCourtsAction(city, dateFilter, durationMinutes);
    }

    const registerCourt = async (clubId: string, dataForm: AddCourt): Promise<Court> => {
        const data: Court = await registerCourtAction(clubId, dataForm)
        clubStore.courts = [data, ...clubStore.courts]
        return data;
    }

    const updateCourt = async (courtId: string, dataForm: PutCourt): Promise<Court> => {
        const data: Court = await updateCourtAction(courtId, dataForm);
        clubStore.courts = clubStore.courts.map(court => 
            court.id === courtId
            ? data
            : court
        );

        return data;
    }

    const deactivateCourt = async (courtId: string): Promise<void> => {
        await deactivateCourtAction(courtId);
        clubStore.courts = clubStore.courts.map(court =>
            court.id === courtId
            ? { ...court, isActive: false }
            : court
        );
    }

    const activateCourt = async (courtId: string): Promise<void> => {
        await activateCourtAction(courtId);
        clubStore.courts = clubStore.courts.map(court =>
            court.id === courtId
            ? { ...court, isActive: true }
            : court
        );
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
    }
}