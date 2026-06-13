import type { AxiosRequestConfig } from "axios";
import type { AddClub, PutClub } from "../interfaces";

const baseURL = "api/clubs";

function getAdminClubContext() : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/admin-context`,
    }
}

function getClubs() : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}`,
    }
}

function getClubById(clubId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}`,
    }
}

function getClubsBySearch(name: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/search`,
        params: {name}
    }
}

function registerClub(data : AddClub) : AxiosRequestConfig<AddClub> {
    return {
        method: 'POST',
        url: `${baseURL}`,
        data: data,
    }
}

function putClub(clubId: string, data: PutClub) : AxiosRequestConfig<PutClub> {
    return {
        method: 'PUT',
        url: `${baseURL}/${clubId}`,
        data: data,
    }
}

function deactivateClub(clubId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${clubId}/deactivate`,
    }
}

function activateClub(clubId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${clubId}/activate`,
    }
}


export default {
    getAdminClubContext,
    getClubs,
    getClubById,
    getClubsBySearch,
    registerClub,
    putClub,
    deactivateClub,
    activateClub
}