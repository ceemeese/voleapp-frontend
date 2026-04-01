import { getCourtsAction } from "@/modules/club/actions";
import type { Court } from "@/modules/club/interfaces";
import { ref } from "vue";

export const useCourts = () => {
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
            const data: Court[] = await getCourtsByClubId(clubId)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getCourtById = async (courtId: string): Promise<Court> => {
        isLoading.value = true;

        try {
            const data: Court = await getCourtById(courtId)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const registerCourt = async (clubId: string): Promise<string> => {
        isLoading.value = true;

        try {
            const data: string = await registerCourt(clubId)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await registerCourt(courtId);
        } finally {
            isLoading.value = false;
        }
    }

    const deactivateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await deactivateCourt(courtId);
        } finally {
            isLoading.value = false;
        }
    }

    const activateCourt = async (courtId: string): Promise<void> => {
        isLoading.value = true;

        try {
            await activateCourt(courtId);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        getAllCourts,
        getCourtsByClubId,
        getCourtById,
        registerCourt,
        updateCourt,
        deactivateCourt,
        activateCourt,
    }
}