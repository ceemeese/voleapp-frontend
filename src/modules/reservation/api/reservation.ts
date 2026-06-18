import type { AxiosRequestConfig } from "axios";
import type { AddReservation, ReservationFilters } from '../interfaces'

const baseURL = "api/reservations";

function getReservations(filters : ReservationFilters) : AxiosRequestConfig {
    const {userId, clubId, startDateRange, endDateRange } = filters;
    return {
        method: 'GET',
        url: `${baseURL}`,
        params: {
            userId,
            clubId,
            startDateRange: startDateRange instanceof Date ? startDateRange.toISOString() : startDateRange,
            endDateRange: endDateRange instanceof Date ? endDateRange.toISOString() : endDateRange,
        }
    }
}

function getUserReservations(userId: string, startDateRange?: string|Date, endDateRange?: string|Date) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `api/users/${userId}/reservations`,
        params: {
            startDateRange: startDateRange instanceof Date ? startDateRange.toISOString() : startDateRange,
            endDateRange: endDateRange instanceof Date ? endDateRange.toISOString() : endDateRange,
        }
    }
}

function getClubReservations(clubId: string, startDateRange?: string|Date, endDateRange?: string|Date) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `api/clubs/${clubId}/reservations`,
        params: {
            startDateRange: startDateRange instanceof Date ? startDateRange.toISOString() : startDateRange,
            endDateRange: endDateRange instanceof Date ? endDateRange.toISOString() : endDateRange,
        }
    }
}

function getReservationById(reservationId: number) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${reservationId}`,
    }
}

function createReservation(dataForm: AddReservation) : AxiosRequestConfig {
    return {
        method: 'POST',
        url: `${baseURL}`,
        data: dataForm,
    }
}

function updateStatusReservation(reservationId: number, newStatus: number) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${reservationId}/status`,
        data: {newStatus},
    }
}

function cancelReservation(reservationId: number) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${reservationId}/cancel`,
    }
}

function confirmPayment(reservationId: number, sessionId: string) : AxiosRequestConfig {
    return {
        method: 'POST',
        url: `${baseURL}/${reservationId}/confirm-payment`,
        data: { sessionId },
    }
}

export default {
    getReservations,
    getUserReservations,
    getClubReservations,
    getReservationById,
    createReservation,
    updateStatusReservation,
    cancelReservation,
    confirmPayment,
}