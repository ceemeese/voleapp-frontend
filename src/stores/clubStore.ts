import type { Club, Court, Schedule } from "@/modules/club/interfaces";
import { defineStore } from "pinia"
import { ref, computed } from "vue";

export const useClubStore = defineStore('club', () => {
    const activeClubId = ref<string| null>(null);
    const currentClubData = ref<Club | null>(null);
    const schedules = ref<Schedule[]>([]);
    const courts = ref<Court[]>([]);

    const todaySchedule = computed(() => {
        const date = new Date();
        const todayIndex = date.getDay() === 0 ? 7 : date.getDay();

        return schedules.value
            .filter(s => s.dayOfWeek.id === todayIndex && !s.isClosed)
            .sort((a, b) => a.openingTime.localeCompare(b.openingTime));
    })

    function clearClub() {
        activeClubId.value = null;
        currentClubData.value = null;
    }

    return { activeClubId, currentClubData, clearClub, todaySchedule, schedules, courts }
})