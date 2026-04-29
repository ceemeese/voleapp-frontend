export interface AddReservation {
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}