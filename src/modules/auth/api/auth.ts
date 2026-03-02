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


export default{
    login,
}