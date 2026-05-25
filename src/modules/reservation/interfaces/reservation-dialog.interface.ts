import type { PriceBreakdown } from "./reservation.interface";

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
    price: PriceBreakdown;
    createdAt?: Date;
}