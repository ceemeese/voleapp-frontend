export interface AnalyticsResponse {
    totalRevenuePeriod: number;
    averageRevenuePeriod: number;
    totalReservationsPeriod: number;
    totalNewUsersCount: number;
    evolutionDate: MonthPerformanceResponse[];
}


interface MonthPerformanceResponse {
    monthName: string;
    monthNumber: number;
    totalRevenue: number;
    totalReservations: number;
}