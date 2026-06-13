import { getGlobalAnalyticsStatsAction, getGlobalDashboardStatsAction, getGlobalOccupancyStatsAction } from "@/modules/admin/actions";
import { getAnalyticsStatsAction, getDashboardStatsAction, getOccupancyStatsAction } from "@/modules/club/actions";

export const useAnalytics = () => {
    const clubStore = useClubStore();
    const activeClubId = computed(() => clubStore.activeClubId);

    const getDashboardStats = () => {
        if (!activeClubId.value) return;
        return getDashboardStatsAction(activeClubId.value);
    }

    const getAnalyticsStats = (year: number, month: number) => {
        if (!activeClubId.value) return;
        return getAnalyticsStatsAction(activeClubId.value, year, month)
    }

    const getOccupancyStats = (year: number, month: number) => {
        if (!activeClubId.value) return;
        return getOccupancyStatsAction(activeClubId.value, year, month);
    }

    const getGlobalDashboardStats = () => {
        return getGlobalDashboardStatsAction();
    }

    const getGlobalAnalyticsStats = (year: number, month: number) => {
        return getGlobalAnalyticsStatsAction(year, month);
    }

    const getGlobalOccupancyStats = (year: number, month: number) => {
        return getGlobalOccupancyStatsAction(year, month);
    }

    return {
        getDashboardStats,
        getAnalyticsStats,
        getOccupancyStats,
        getGlobalDashboardStats,
        getGlobalAnalyticsStats,
        getGlobalOccupancyStats
    }
}