import type { PriceResponse } from "@/modules/reservation/interfaces";
import type { CourtTypeResponse } from "./court.response";

export interface CourtAvailabilityDetail {
    id: string;
    name: string;
    type: CourtTypeResponse;
    price: PriceResponse;
    isActive: boolean;
}