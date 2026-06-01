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

    const getDashboardStats = async () => {
        if (!activeClubId.value) return;

        isLoading.value = true;
        try {
            const data: DashboardResponse = await getDashboardStatsAction(activeClubId.value);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getAnalyticsStats = async (year: number, month: number) => {
        if (!activeClubId.value) return;

        isLoading.value = true;
        try {
            const data: AnalyticsResponse = await getAnalyticsStatsAction(activeClubId.value, year, month)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getOccupancyStats = async (year: number, month: number) => {
        if (!activeClubId.value) return;

        isLoading.value = true;
        try {
            const data: OccupancyResponse = await getOccupancyStatsAction(activeClubId.value, year, month);
            return data;
        } finally {
            isLoading.value = false;
        }
    }



    return {
        getDashboardStats,
        getAnalyticsStats,
        getOccupancyStats,
        isLoading,
    }
}