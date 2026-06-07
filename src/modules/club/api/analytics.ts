import type { AxiosRequestConfig } from "axios";

const baseURL = "api/clubs"

function getDashboard(clubId: string): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/dashboard`,
    }
}

function getAnalytics(clubId: string, year: number, month: number): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/analytics`,
        params: { year, month }
    }
}

function getOccupancy(clubId: string, year: number, month: number): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/occupancy`,
        params: { year, month }
    }
}

export default {
    getDashboard,
    getAnalytics,
    getOccupancy
}