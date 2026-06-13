import type { AxiosRequestConfig } from "axios";
import type { AddSchedule, PutSchedule } from "../interfaces";

const baseURL = "api/clubs";

function getScheduleByClub(clubId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/schedules`,
    }
}

function registerScheduleByClub(clubId: string, data: AddSchedule) : AxiosRequestConfig<AddSchedule> {
    return {
        method: 'POST',
        url: `${baseURL}/${clubId}/schedules`,
        data: data,
    }
}


function putScheduleByClub(clubId: string, scheduleId: number, data: PutSchedule) : AxiosRequestConfig<PutSchedule> {
    return {
        method: 'PUT',
        url: `${baseURL}/${clubId}/schedules/${scheduleId}`,
        data: data,
    }
}

function toggleScheduleState(clubId: string, scheduleId: number) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${clubId}/schedules/${scheduleId}/toggle`,
    }
}

export default {
    getScheduleByClub,
    registerScheduleByClub,
    putScheduleByClub,
    toggleScheduleState,
}