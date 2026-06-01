import type { AxiosRequestConfig } from "axios";

const baseURL = "api/analytics"

function getDashboard(clubId: string): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/dashboard/${clubId}`
    }
}

function getAnalytics(clubId: string, year: number, month: number): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/analytics/${clubId}`,
        params: { year, month }
    }
}

function getOccupancy(clubId: string, year: number, month: number): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/occupancy/${clubId}`,
        params: { year, month }
    }
}

export default {
    getDashboard,
    getAnalytics,
    getOccupancy
}