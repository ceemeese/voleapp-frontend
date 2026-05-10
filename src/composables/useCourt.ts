import { activateCourtAction, deactivateCourtAction, getCourtByIdAction, getCourtsAction, getCourtsByClubIdAction, registerCourtAction, updateCourtAction } from "@/modules/club/actions";
import { getAvailableCourtsAction } from "@/modules/club/actions/courts/get-availables-court.action";
import type { AddCourt, Court, CourtGroupedResponse, PutCourt } from "@/modules/club/interfaces";
import { ref } from "vue";

export const useCourt = () => {
    const isLoading = ref(false);

    const getAllCourts = async (): Promise<Court[]> => {
        isLoading.value = true;

        try {
            const data: Court[] = await getCourtsAction()
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getCourtsByClubId = async (clubId: string): Promise<Court[]> => {
        isLoading.value = true;

        try {
            const data: Court[] = await getCourtsByClubIdAction(clubId)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getCourtById = async (courtId: string): Promise<Court> => {
        isLoading.value = true;

        try {
            const data: Court = await getCourtByIdAction(courtId)
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
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateCourt = async (courtId: string, dataForm: PutCourt): Promise<Court> => {
        isLoading.value = true;

        try {
            const data: Court = await updateCourtAction(courtId, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const deactivateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await deactivateCourtAction(courtId);
        } finally {
            isLoading.value = false;
        }
    }

    const activateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await activateCourtAction(courtId);
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
    }
}