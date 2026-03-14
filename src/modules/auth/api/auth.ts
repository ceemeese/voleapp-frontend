import type { AxiosRequestConfig } from "axios";
import type { Login, Register } from "../interfaces";

//const baseURL = "/Auth";

function login(data: Login) : AxiosRequestConfig<Login> {
    return {
        method: 'POST',
        url: `/login`,
        data: data,
    };
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