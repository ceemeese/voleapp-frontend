import type { AxiosRequestConfig } from "axios";
import type { AddCourt, PutCourt } from "../interfaces";

const baseURL = "/api/courts";

function getAllCourts() : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}`,
    }
}

function getCourtsByClubId(clubId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `/api/clubs/${clubId}/courts`
    }
}

function getCourtById(courtId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${courtId}`
    }
}

function registerCourt(clubId: string, data : AddCourt) : AxiosRequestConfig<AddCourt> {
    return {
        method: 'POST',
        url: `/api/clubs/${clubId}/courts`,
        data: data,
    }
}

function putCourt(courtId: string, data : PutCourt) : AxiosRequestConfig<PutCourt> {
    return {
        method: 'PUT',
        url: `${baseURL}/${courtId}`,
        data: data,
    }
}

function deactivateCourt(courtId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${courtId}/deactivate`,
    }
}

function activateCourt(courtId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${courtId}/activate`,
    }
}

function availabilityCourt(city: string, dateFilter: Date, durationMinutes: number) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/availability`,
        params: {
            city: city,
            dateFilter: dateFilter,
            durationMinutes: durationMinutes
        }
    }
}

export default {
    getAllCourts,
    getCourtsByClubId,
    getCourtById,
    registerCourt,
    putCourt,
    deactivateCourt,
    activateCourt,
    availabilityCourt,
}