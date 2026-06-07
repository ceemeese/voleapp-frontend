import type { DayOccupancyResponse, MonthOccupancyResponse } from "@/modules/club/interfaces";

export interface GlobalOccupancyResponse {
    occupancyByDayOfWeek: DayOccupancyResponse[],
    occupancyByClub: GlobalClubOccupancyResponse[],
    occupancyEvolution: MonthOccupancyResponse[]
}

interface GlobalClubOccupancyResponse {
    position?: number;
    clubId: string;
    clubName: string;
    occupancyRate: number;
}
