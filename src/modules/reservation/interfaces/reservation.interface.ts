export interface Reservation {
    id: number;
    userId: string;
    clubId: string;
    courtId: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: Status;
    totalPrice: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date; 
}

export interface Status {
    id: ReservationStatus;
    status: string;
}

export enum ReservationStatus {
    Pending = 1,
    Confirmed = 2,
    Cancelled = 3,
    Completed = 4,
    Failed = 5,
    Refunded = 6,
}