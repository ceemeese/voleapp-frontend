import type { AxiosRequestConfig } from "axios";
import type { Login, Register, ChangePassword, ResetPassword } from "../interfaces";

const baseURL = "api/Auths";

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
        url: `api/users`,
        data: data,
    };
}

function putPasswordConfig(data: ChangePassword) : AxiosRequestConfig<ChangePassword> {
    return {
        method: 'POST',
        url: `${baseURL}/changePassword`,
        data: data,
    };
}

function resetPasswordConfig(data: ResetPassword) : AxiosRequestConfig<ResetPassword> {
    return {
        method: 'POST',
        url: `${baseURL}/resetPassword`,
        data: data,
    };
}


export default{
    login,
    register,
    putPasswordConfig,
    resetPasswordConfig,
}