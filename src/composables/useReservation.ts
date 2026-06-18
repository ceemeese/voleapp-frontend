import { getClubReservationsAction, getReservationByIdAction, getReservationsAction, getUserReservationsAction, registerReservationAction, updateStatusReservationAction, cancelReservationAction, confirmPaymentAction } from "@/modules/reservation/actions";
import { ReservationStatus, type AddReservation, type Reservation, type ReservationComplete, type ReservationFilters } from "@/modules/reservation/interfaces"
import { STATUS_EN } from "@/utils/status-utils";

export const useReservation = () => {
    const userStore = useUserStore();
    const userReservations = computed(() => userStore.reservations);


    const getReservations = (filters : ReservationFilters) : Promise<Reservation[]> => {
        return getReservationsAction(filters);
    }

    const getReservationById = (reservationId: number) : Promise<Reservation> => {
        return getReservationByIdAction(reservationId);
    }

    const getClubReservations = (clubId: string, startDateRange?: string, endDateRange?: string) : Promise<ReservationComplete[]> => {
        return getClubReservationsAction(clubId, startDateRange, endDateRange);
    }

    const getUserReservations = async (userId: string, startDateRange?: string, endDateRange?: string) : Promise<ReservationComplete[]> => {
        const data: ReservationComplete[] = await getUserReservationsAction(userId, startDateRange, endDateRange);
        userStore.upsertReservations(data);
        return data;
    }

    const registerReservation = (formData: AddReservation) : Promise<Reservation> => {
        return registerReservationAction(formData);
    }

    const updateStatusReservation = async (reservationId: number, newStatus: number) : Promise<void> => {
        
        await updateStatusReservationAction(reservationId, newStatus);
        
        const reservation = userStore.reservations.find(res => res.id === reservationId);
        if (reservation) {
            reservation.status.id = newStatus;
            reservation.status.status = STATUS_EN[newStatus] ?? 'Unknown';
        }
    }

    const cancelReservation = async (reservationId: number) : Promise<void> => {

        await cancelReservationAction(reservationId);
        const reservation = userStore.reservations.find(res => res.id === reservationId);

        if (reservation) {
            reservation.status.id = ReservationStatus.Cancelled;
            reservation.status.status = STATUS_EN[ReservationStatus.Cancelled] ?? 'Cancelled';
        }
    }

    const confirmPayment = (reservationId: number, sessionId: string): Promise<void> => {
        return confirmPaymentAction(reservationId, sessionId);
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
        confirmPayment,
        userReservations,
        refreshCurrentUserReservations
    }
}