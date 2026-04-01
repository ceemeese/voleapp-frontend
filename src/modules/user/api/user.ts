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

function deleteUser(id: string) : AxiosRequestConfig {
    return {
        method: 'DELETE',
        url: `${baseURL}/${id}`,
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
    deleteUser,
    putUser,
}



