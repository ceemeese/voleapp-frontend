export interface ReservationDataDialog {
    id?: number;
    courtId: string;
    courtName: string;
    courtType: string;
    clubName: string;
    clubAddress: string;
    date: string;
    startTime: string;
    endTime: string;
    status?: string;
    duration: number;
    price: number
    createdAt?: Date;
}