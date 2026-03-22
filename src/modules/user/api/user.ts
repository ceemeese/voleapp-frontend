import type { AxiosRequestConfig } from "axios";
import type { PutUser } from "../interfaces";

const baseURL = "/Users";


function getUsers() : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `api${baseURL}`,
    }
}

function getUserById(id: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `api${baseURL}/${id}`,
    }
}

function getUserByEmail(email: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `api${baseURL}/search`,
        params: {email}
    }
}

function deleteUser(id: string) : AxiosRequestConfig {
    return {
        method: 'DELETE',
        url: `api${baseURL}/${id}`,
    }
}

function putUser(id: string, data: PutUser) : AxiosRequestConfig<PutUser> {
    return {
        method: 'PUT',
        url: `api${baseURL}/${id}`,
        data: data,
    }
}

export default {
    getUsers,
    getUserById,
    getUserByEmail,
    deleteUser,
    putUser,
}



