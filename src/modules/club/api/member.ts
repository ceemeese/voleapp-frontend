import type { AxiosRequestConfig } from "axios";
import type { AddMember, PutMember } from "../interfaces";

const baseURL = "/api/clubs";

function getMembersByClub(clubId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/members`,
    }
}

function getMemberDetail(clubId: string, memberId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/members/${memberId}`,
    }
}

function registerMember(clubId: string, data: AddMember) : AxiosRequestConfig<AddMember> {
    return {
        method: 'POST',
        url: `${baseURL}/${clubId}/members`,
        data: data,
    }
}

function putMember(clubId: string, memberId: string, data: PutMember) : AxiosRequestConfig<PutMember> {
    return {
        method: 'PUT',
        url: `${baseURL}/${clubId}/members/${memberId}`,
        data: data,
    }
}

function deactivateMember(clubId: string, memberId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${clubId}/members/${memberId}/deactivate`,
    }
}

function activateMember(clubId: string, memberId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${clubId}/members/${memberId}/activate`,
    }
}

function toggleFavouriteClub(clubId: string, memberId: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${clubId}/members/${memberId}/favourite`,
    }
}

export default {
    getMembersByClub,
    getMemberDetail,
    registerMember,
    putMember,
    deactivateMember,
    activateMember,
    toggleFavouriteClub,
}
