import { getAnalyticsStatsAction } from "@/modules/club/actions/analytics/get-analytics.action";
import { getDashboardStatsAction } from "@/modules/club/actions/analytics/get-dashboard.action";
import { getOccupancyStatsAction } from "@/modules/club/actions/analytics/get-occupancy.action";
import type { AnalyticsResponse, DashboardResponse } from "@/modules/club/interfaces";
import type { OccupancyResponse } from "@/modules/club/interfaces/analytics/occupancy.response";
import { useClubStore } from "@/stores/clubStore";
import { computed, ref } from "vue";



export const useAnalytics = () => {
    const isLoading = ref(false);
    const clubStore = useClubStore();
    const activeClubId = computed(() => clubStore.activeClubId);

    const getDashboardStats = async (clubId: string) => {
        if (!activeClubId.value) return;

        isLoading.value = true;
        try {
            const data: DashboardResponse = await getDashboardStatsAction(clubId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getAnalyticsStats = async (clubId: string, year: number, month: number) => {
        if (!activeClubId.value) return;

        isLoading.value = true;
        try {
            const data: AnalyticsResponse = await getAnalyticsStatsAction(clubId, year, month)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getOccupancyStats = async (clubId: string, year: number, month: number) => {
        if (!activeClubId.value) return;

        isLoading.value = true;
        try {
            const data: OccupancyResponse = await getOccupancyStatsAction(clubId, year, month);
            return data;
        } finally {
            isLoading.value = false;
        }
    }



    return {
        getDashboardStats,
        getAnalyticsStats,
        getOccupancyStats,
    }
}