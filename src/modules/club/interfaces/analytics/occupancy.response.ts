export interface OccupancyResponse {
    occupancyByDayOfWeek: DayOccupancyResponse[],
    occupancyByCourt: CourtOccupancyResponse[],
    occupancyEvolution: MonthOccupancyResponse[]
}


export interface DayOccupancyResponse {
    dayName: string;
    occupancyRate: number;
}

interface CourtOccupancyResponse {
    courtId: string;
    courtName: string;
    occupancyRate: number;
}

export interface MonthOccupancyResponse {
    monthName: string;
    monthNumber: number;
    occupancyRate: number;
}