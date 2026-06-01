export interface DashboardResponse {
    todayRevenue: number;
    averageTicketToday: number;
    todayTotalReservations: number;
    todayTotalClubEvents: number;
    todayGlobalOccupancyRate: number;
    cancelledReservationsToday: number;
    peakHourToday: string;
}