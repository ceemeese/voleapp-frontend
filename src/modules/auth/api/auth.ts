import type { AxiosRequestConfig } from "axios";

//const baseURL = "/Auth";

export interface Login {
    username: string;
    password: string;
}

function login(data: Login) : AxiosRequestConfig<Login> {
    return {
        method: 'POST',
        url: `/login`,
        data: data,
    };
}

export interface Register {
    dni: string;
    name: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
}

function register(data: Register) : AxiosRequestConfig<Register> {
    return {
        method: 'POST',
        url: `/api/users`,
        data: data,
    };
}


export default{
    login,
    register,
}