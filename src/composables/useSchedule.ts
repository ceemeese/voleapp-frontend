import { getScheduleByIdClubAction, putScheduleAction, registerScheduleAction, toggleScheduleStatusAction } from "@/modules/club/actions";
import type { AddSchedule, PutSchedule, Schedule } from "@/modules/club/interfaces";
import { ref, computed } from "vue";
import { useClubStore } from "@/stores/clubStore";

export const useSchedule = () => {
    const clubStore = useClubStore();
    const isLoading = ref(false);
    const schedules = computed(() => clubStore.schedules);
    const todaySchedule = computed(() => clubStore.todaySchedule);

    const getSchedule = async (clubId: string) :Promise<Schedule[]> => {
        isLoading.value = true;
        
        try {
            const data: Schedule[] = await getScheduleByIdClubAction(clubId);
            clubStore.schedules = data;
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    const registerSchedule = async(clubId: string, dataForm: AddSchedule) : Promise<Schedule> => {
        isLoading.value = true;
        
        try {
            const data: Schedule = await registerScheduleAction(clubId, dataForm)
            clubStore.schedules = [...clubStore.schedules, data];
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateSchedule = async(clubId: string, scheduleId: number, dataForm: PutSchedule) : Promise<Schedule> => {
        isLoading.value = true;
        
        try {
            const data: Schedule = await putScheduleAction(clubId, scheduleId, dataForm);
            clubStore.schedules = clubStore.schedules.map(schedule => 
                schedule.id === scheduleId
                ? {...schedule, ...data}
                : schedule
            );
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const toggleSchedule = async(clubId: string, scheduleId: number) :Promise<void> => {
        isLoading.value = true;

        try {
            await toggleScheduleStatusAction(clubId, scheduleId);
            clubStore.schedules = clubStore.schedules.map(schedule =>
                schedule.id === scheduleId
                    ? {...schedule, isClosed: !schedule.isClosed}
                    : schedule
            )
        } finally {
            isLoading.value = false;
        }
    }


    return {
        getSchedule,
        registerSchedule,
        updateSchedule,
        toggleSchedule,
        schedules,
        todaySchedule,
    }
}