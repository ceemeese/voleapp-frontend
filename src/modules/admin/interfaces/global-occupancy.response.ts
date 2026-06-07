import type { DayOccupancyResponse, MonthOccupancyResponse } from "@/modules/club/interfaces";

export interface GlobalOccupancyResponse {
    occupancyByDayOfWeek: DayOccupancyResponse[],
    occupancyByCourt: GlobalClubOccupancyResponse[],
    occupancyEvolution: MonthOccupancyResponse[]
}

interface GlobalClubOccupancyResponse {
    clubId: string;
    courtName: string;
    occupancyRate: number;
}
