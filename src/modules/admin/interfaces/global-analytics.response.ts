export interface GlobalAnalyticsResponse {
    totalRevenuePeriod: number;
    totalClubsPeriod: number;
    totalReservationsPeriod: number;
    totalNewPlayersCount: number;
    averageReservationsPerClub: number;
    monthlyEvolution: GlobalMonthPerformanceDto[];
}

export interface GlobalMonthPerformanceDto {
    month: string;
    monthNumber: number;
    totalRevenue: number;
    totalReservations: number;
    totalClubs: number;
    totalPlayers: number;
}