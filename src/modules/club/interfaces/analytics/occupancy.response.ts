export interface OccupancyResponse {
    occupancyByDayOfWeek: DayOccupancyResponse[],
    occupancyByCourt: CourtOccupancyResponse[],
    occupancyEvolution: MonthOccupancyResponse[]
}


interface DayOccupancyResponse {
    dayName: string;
    occupancyRate: number;
}

interface CourtOccupancyResponse {
    courtId: string;
    courtName: string;
    occupancyRate: number;
}

interface MonthOccupancyResponse {
    monthName: string;
    monthNumber: number;
    occupancyRate: number;
}