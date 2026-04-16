import { getScheduleByIdClubAction, putScheduleAction, registerScheduleAction, toggleScheduleStatusAction } from "@/modules/club/actions";
import type { AddSchedule, PutSchedule, Schedule } from "@/modules/club/interfaces";
import { ref } from "vue";

export const useSchedule = () => {
    const isLoading = ref(false);

    const getSchedule = async (clubId: string) :Promise<Schedule[]> => {
        isLoading.value = true;
        
        try {
            const data: Schedule[] = await getScheduleByIdClubAction(clubId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    const registerSchedule = async(clubId: string, dataForm: AddSchedule) : Promise<Schedule> => {
        isLoading.value = true;
        
        try {
            const data: Schedule = await registerScheduleAction(clubId, dataForm)
            console.log(data, 'DTA DEVUELTAAAA')
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateSchedule = async(clubId: string, scheduleId: number, dataForm: PutSchedule) : Promise<Schedule> => {
        isLoading.value = true;
        
        try {
            const data: Schedule = await putScheduleAction(clubId, scheduleId, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const toggleSchedule = async(clubId: string, scheduleId: number) :Promise<void> => {
        isLoading.value = true;

        try {
            await toggleScheduleStatusAction(clubId, scheduleId);
        } finally {
            isLoading.value = false;
        }
    }


    return {
        getSchedule,
        registerSchedule,
        updateSchedule,
        toggleSchedule,
    }
}