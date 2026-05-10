import type { CourtTypeResponse } from "./court.response";

export interface CourtSummarizedResponse {
    id: string;
    name: string;
    type: CourtTypeResponse
    basePrice: number;
    isActive: boolean;
}

