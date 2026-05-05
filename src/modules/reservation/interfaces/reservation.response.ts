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
    totalPrice: number;
    notes?: string;
    createdAt: string;
    updatedAt: string; 
}

export interface StatusResponse {
    id: ReservationStatus;
    name: string;
}