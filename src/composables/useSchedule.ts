import { getScheduleByIdClubAction, putScheduleAction, registerScheduleAction, toggleScheduleStatusAction } from "@/modules/club/actions";
import type { AddSchedule, PutSchedule, Schedule } from "@/modules/club/interfaces";


export const useSchedule = () => {
    const clubStore = useClubStore();
    const schedules = computed(() => clubStore.schedules);
    const todaySchedule = computed(() => clubStore.todaySchedule);

    const getSchedule = async (clubId: string) :Promise<Schedule[]> => {
        const data: Schedule[] = await getScheduleByIdClubAction(clubId);
        clubStore.schedules = data;
        return data;
    }


    const registerSchedule = async(clubId: string, dataForm: AddSchedule) : Promise<Schedule> => {
        const data: Schedule = await registerScheduleAction(clubId, dataForm)
        clubStore.schedules = [...clubStore.schedules, data];
        return data;
    }

    const updateSchedule = async(clubId: string, scheduleId: number, dataForm: PutSchedule) : Promise<Schedule> => {
        const data: Schedule = await putScheduleAction(clubId, scheduleId, dataForm);
        clubStore.schedules = clubStore.schedules.map(schedule => 
            schedule.id === scheduleId
            ? {...schedule, ...data}
            : schedule
        );
        return data;
    }

    const toggleSchedule = async(clubId: string, scheduleId: number) :Promise<void> => {
        await toggleScheduleStatusAction(clubId, scheduleId);
        clubStore.schedules = clubStore.schedules.map(schedule =>
            schedule.id === scheduleId
                ? {...schedule, isClosed: !schedule.isClosed}
                : schedule
        )
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