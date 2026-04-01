import type { AxiosRequestConfig } from "axios";
import type { Login, Register } from "../interfaces";

const baseURL = "/api/Auths";

function login(data: Login) : AxiosRequestConfig<Login> {
    return {
        method: 'POST',
        url: `${baseURL}/login`,
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