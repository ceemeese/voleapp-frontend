import type { PriceBreakdown, Status } from "./reservation.interface";

export interface ReservationComplete {
    id: number;
    userId: string;
    username: string;
    clubId: string;
    clubName: string;
    courtId: string;
    courtName: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: Status;
    price: PriceBreakdown;
    notes?: string;
    createdAt: Date;
    updatedAt: Date; 
}