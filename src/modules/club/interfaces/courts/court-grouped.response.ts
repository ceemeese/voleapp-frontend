import type { CourtSummarizedResponse } from "./court-summarized.response";

export interface CourtGroupedResponse {
    clubId: string;
    clubName: string;
    address: string;
    availableCourts: CourtSummarizedResponse;
}