import type { AxiosRequestConfig } from "axios";

const baseURL = "api/management"

function getGlobalDashboard(): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/dashboard`
    }
}

function getGlobalAnalytics(year: number, month: number): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/analytics`,
        params: { year, month }
    }
}

function getGlobalOccupancy(year: number, month: number): AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/occupancy`,
        params: { year, month }
    }
}

export default {
    getGlobalDashboard,
    getGlobalAnalytics,
    getGlobalOccupancy
}