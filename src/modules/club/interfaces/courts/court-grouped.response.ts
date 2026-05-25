import type { CourtAvailabilityDetail } from "./court-availability-detail.response";

export interface CourtGroupedResponse {
    clubId: string;
    clubName: string;
    address: string;
    weatherIcon: string;
    availableCourts: CourtAvailabilityDetail[];
}