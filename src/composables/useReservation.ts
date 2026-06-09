import { getClubReservationsAction, getReservationByIdAction, getReservationsAction, getUserReservationsAction, registerReservationAction, updateStatusReservationAction, cancelReservationAction } from "@/modules/reservation/actions";
import { ReservationStatus, type AddReservation, type Reservation, type ReservationComplete, type ReservationFilters } from "@/modules/reservation/interfaces"
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { STATUS_EN } from "@/utils/status-utils";

export const useReservation = () => {
    const isLoading = ref<boolean>(false);
    const userStore = useUserStore();
    const userReservations = computed(() => userStore.reservations);


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

    const getClubReservations = async(clubId: string, startDateRange?: string, endDateRange?: string) : Promise<ReservationComplete[]> => {
        isLoading.value = true;

        try {
            const data: ReservationComplete[] = await getClubReservationsAction(clubId, startDateRange, endDateRange);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getUserReservations = async(userId: string, startDateRange?: string, endDateRange?: string) : Promise<ReservationComplete[]> => {
        isLoading.value = true;

        try {
            const data: ReservationComplete[] = await getUserReservationsAction(userId, startDateRange, endDateRange);
            userStore.upsertReservations(data);
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
            
            const reservation = userStore.reservations.find(res => res.id === reservationId);
        if (reservation) {
            reservation.status.id = newStatus;
            reservation.status.status = STATUS_EN[newStatus] ?? 'Unknown';
        }
        } finally {
            isLoading.value = false;
        }
    }

    const cancelReservation = async(reservationId: number) : Promise<void> => {
        isLoading.value = true;

        try {
            await cancelReservationAction(reservationId);
            const reservation = userStore.reservations.find(res => res.id === reservationId);

        if (reservation) {
            reservation.status.id = ReservationStatus.Cancelled;
            reservation.status.status = STATUS_EN[ReservationStatus.Cancelled] ?? 'Cancelled';
        }
        } finally {
            isLoading.value = false;
        }
    }

    const refreshCurrentUserReservations = async (): Promise<void> => {
        const userId = userStore.profile?.id;
        if (!userId) return;

        const year = new Date().getFullYear();
        const startDate = `${year}-01-01`; 
        const endDate = `${year}-12-31`;

        await getUserReservations(userId, startDate, endDate);
    };


    return {
        getReservations,
        getReservationById,
        getClubReservations,
        getUserReservations,
        registerReservation,
        updateStatusReservation,
        cancelReservation,
        userReservations,
        isLoading,
        refreshCurrentUserReservations
    }
}