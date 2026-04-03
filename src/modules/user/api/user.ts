import type { AxiosRequestConfig } from "axios";
import type { PutUser } from "../interfaces";

const baseURL = "/api/Users";


function getUsers() : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}`,
    }
}

function getUserById(id: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${id}`,
    }
}

function getUserByEmail(email: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/search`,
        params: {email}
    }
}

function deactivateUser(id: string) : AxiosRequestConfig {
    return {
        method: 'PATCH',
        url: `${baseURL}/${id}/deactivate`,
    }
}

function putUser(id: string, data: PutUser) : AxiosRequestConfig<PutUser> {
    return {
        method: 'PUT',
        url: `${baseURL}/${id}`,
        data: data,
    }
}

export default {
    getUsers,
    getUserById,
    getUserByEmail,
    deactivateUser,
    putUser,
}



