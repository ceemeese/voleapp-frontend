export interface AddReservation {
    userId?: string;
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}