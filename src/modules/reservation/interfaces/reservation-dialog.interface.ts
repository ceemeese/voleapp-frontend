export interface ReservationDataDialog {
    id?: number;
    userId?: string;
    courtId?: string;
    clubId?: string;
    userName?: string;
    courtName?: string;
    type?: string;
    clubName?: string;
    clubAddress?: string;
    date: string;
    startTime: string;
    endTime: string;
    status?: string;
    duration?: number;
    totalPrice: number
    createdAt?: Date;
}