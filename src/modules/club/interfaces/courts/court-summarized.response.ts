import type { CourtTypeResponse } from "./court.response";

export interface CourtSummarizedResponse {
    id: string;
    name: string;
    courtType: CourtTypeResponse
    basePrice: number;
    isActive: boolean;
}

