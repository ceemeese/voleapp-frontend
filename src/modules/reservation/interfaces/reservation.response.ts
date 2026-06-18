import type { ReservationStatus } from "./reservation.interface";

export interface ReservationResponse {
    id: number;
    userId: string;
    clubId: string;
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: StatusResponse;
    price: PriceResponse;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    checkoutUrl?: string;
}

export interface StatusResponse {
    id: ReservationStatus;
    status: string;
}

export interface PriceResponse {
    basePrice: number;
    totalPrice: number;
    discountAmount: number;
    appliedDiscountPercent: number;
    discountReason?: string;
}