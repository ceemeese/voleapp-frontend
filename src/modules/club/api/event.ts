import type { AxiosRequestConfig } from "axios";
import type { AddEvent, PutEvent } from '../interfaces'

const baseURL = "api/courts";

function getEventsRangeByCourt(courtId: string, startRange: string|Date, endRange?: string|Date ) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${courtId}/events/search`,
        params: {
            startRange : startRange instanceof Date ? startRange.toISOString() : startRange,
            endRange : endRange instanceof Date ? endRange.toISOString() : endRange,
        } 
    }
}

function getEventsRangeByClub(clubId: string, startRange: string|Date, endRange?: string|Date ) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `api/clubs/${clubId}/courts/events/search`,
        params: {
            startRange : startRange instanceof Date ? startRange.toISOString() : startRange,
            endRange : endRange instanceof Date ? endRange.toISOString() : endRange,
        } 
    }
}

function getEventById(courtId: string, eventId: number ) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${courtId}/events/${eventId}`,
    }
}

function registerEventInCourt(courtId: string, dataForm: AddEvent) : AxiosRequestConfig {
    return {
        method: 'POST',
        url: `${baseURL}/${courtId}/events`,
        data: dataForm,
    }
}

function updateEventInCourt(courtId: string, eventId: number, dataForm: PutEvent) : AxiosRequestConfig {
    return {
        method: 'PUT',
        url: `${baseURL}/${courtId}/events/${eventId}`,
        data: dataForm,
    }
}

function deleteEventInCourt(courtId: string, eventId: number) : AxiosRequestConfig {
    return {
        method: 'DELETE',
        url: `${baseURL}/${courtId}/events/${eventId}`,
    }
}



export default {
    getEventsRangeByCourt,
    getEventsRangeByClub,
    getEventById,
    registerEventInCourt,
    updateEventInCourt,
    deleteEventInCourt
}

