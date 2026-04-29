import { getClubReservationsAction, getReservationByIdAction, getReservationsAction, getUserReservationsAction, registerReservationAction, updateStatusReservationAction, cancelReservationAction } from "@/modules/reservation/actions";
import type { AddReservation, Reservation, ReservationFilters } from "@/modules/reservation/interfaces"
import { ref } from "vue";

export const useReservation = () => {
    const isLoading = ref(false);


    const getReservations = async(filters : ReservationFilters) : Promise<Reservation[]> => {
        isLoading.value = true;

        try {
            const data: Reservation[] = await getReservationsAction(filters);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getReservationById = async(reservationId: number) : Promise<Reservation> => {
        isLoading.value = true;

        try {
            const data: Reservation = await getReservationByIdAction(reservationId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getClubReservations = async(clubId: string, startDateRange?: Date, endDateRange?: Date) : Promise<Reservation[]> => {
        isLoading.value = true;

        try {
            const data: Reservation[] = await getClubReservationsAction(clubId, startDateRange, endDateRange);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getUserReservations = async(userId: string, startDateRange?: Date, endDateRange?: Date) : Promise<Reservation[]> => {
        isLoading.value = true;

        try {
            const data: Reservation[] = await getUserReservationsAction(userId, startDateRange, endDateRange);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const registerReservation = async(formData: AddReservation) : Promise<Reservation> => {
        isLoading.value = true;

        try {
            const data: Reservation = await registerReservationAction(formData);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateStatusReservation = async(reservationId: number, newStatus: number) : Promise<void> => {
        isLoading.value = true;

        try {
            await updateStatusReservationAction(reservationId, newStatus);
        } finally {
            isLoading.value = false;
        }
    }

    const cancelReservation = async(reservationId: number) : Promise<void> => {
        isLoading.value = true;

        try {
            await cancelReservationAction(reservationId);
        } finally {
            isLoading.value = false;
        }
    }


    return {
        getReservations,
        getReservationById,
        getClubReservations,
        getUserReservations,
        registerReservation,
        updateStatusReservation,
        cancelReservation,
    }
}