import type { EventResponse } from "../events/event.response";

export interface CourtResponse {
    id: string;
    clubId: string;
    name: string;
    type: CourtTypeResponse;
    basePrice: number;
    isActive: boolean;
    createdAt: string;
    courtEvents: EventResponse[];
}


export interface CourtTypeResponse {
    id: number;
    name: string;
}
