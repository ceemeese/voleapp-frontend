import type { PriceResponse, StatusResponse } from "./reservation.response";

export interface ReservationCompleteResponse {
        id: number;
        userId: string;
        username: string;
        clubId: string;
        clubName: string;
        courtId: string;
        courtName: string;
        date: string;
        startTime: string;
        endTime: string;
        status: StatusResponse;
        price: PriceResponse;
        notes?: string;
        createdAt: string;
        updatedAt: string; 
}