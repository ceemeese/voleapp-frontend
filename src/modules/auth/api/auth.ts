import type { AxiosRequestConfig } from "axios";
import type { Login, Register, ChangePassword, ResetPassword, ForgotPassword } from "../interfaces";

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
        url: `${baseURL}/change-password`,
        data: data,
    };
}


function forgotPasswordConfig(data: ForgotPassword) : AxiosRequestConfig<ForgotPassword> {
    return {
        method: 'POST',
        url: `${baseURL}/forgot-password`,
        data: data,
    };
}

function resetPasswordConfig(data: ResetPassword) : AxiosRequestConfig<ResetPassword> {
    return {
        method: 'POST',
        url: `${baseURL}/reset-password`,
        data: data,
    };
}



export default{
    login,
    register,
    putPasswordConfig,
    forgotPasswordConfig,
    resetPasswordConfig,
}