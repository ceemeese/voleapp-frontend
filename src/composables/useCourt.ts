import { activateCourtAction, deactivateCourtAction, getCourtByIdAction, getCourtsAction, getCourtsByClubIdAction, registerCourtAction, updateCourtAction } from "@/modules/club/actions";
import { getAvailableCourtsAction } from "@/modules/club/actions/courts/get-availables-court.action";
import type { AddCourt, Court, CourtGroupedResponse, PutCourt } from "@/modules/club/interfaces";
import { ref, computed } from "vue";
import { useClubStore } from "@/stores/clubStore";

export const useCourt = () => {
    const clubStore = useClubStore();
    const isLoading = ref(false);
    const courts = computed(() => clubStore.courts);

    const getAllCourts = async (): Promise<Court[]> => {
        isLoading.value = true;

        try {
            const data: Court[] = await getCourtsAction();
            clubStore.courts = data;
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getCourtsByClubId = async (clubId: string): Promise<Court[]> => {
        isLoading.value = true;

        try {
            const data: Court[] = await getCourtsByClubIdAction(clubId);
            clubStore.courts = data;
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getCourtById = async (courtId: string): Promise<Court> => {
        isLoading.value = true;

        try {
            const data: Court = await getCourtByIdAction(courtId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const searchAvailability = async (city: string, dateFilter: Date, durationMinutes: number): Promise<CourtGroupedResponse[]> => {
        isLoading.value = true;

        try {
            const data = await getAvailableCourtsAction(city, dateFilter, durationMinutes);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const registerCourt = async (clubId: string, dataForm: AddCourt): Promise<Court> => {
        isLoading.value = true;

        try {
            const data: Court = await registerCourtAction(clubId, dataForm)
            clubStore.courts = [data, ...clubStore.courts]
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateCourt = async (courtId: string, dataForm: PutCourt): Promise<Court> => {
        isLoading.value = true;

        try {
            const data: Court = await updateCourtAction(courtId, dataForm);
            clubStore.courts = clubStore.courts.map(court => 
                court.id === courtId
                ? data
                : court
            );
            console.log(clubStore.courts, 'COURTSSSS')

            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const deactivateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await deactivateCourtAction(courtId);
            clubStore.courts = clubStore.courts.map(court =>
                court.id === courtId
                ? { ...court, isActive: false }
                : court
            );
        } finally {
            isLoading.value = false;
        }
    }

    const activateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await activateCourtAction(courtId);
            clubStore.courts = clubStore.courts.map(court =>
                court.id === courtId
                ? { ...court, isActive: true }
                : court
            );
        } finally {
            isLoading.value = false;
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
    }
}