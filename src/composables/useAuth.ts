import { changePasswordAction, forgotPasswordAction, loginAction, registerAction, resetPasswordAction } from "@/modules/auth/actions"; 
import { useAuthStore } from "@/stores/authStore"
import type { LoginResponse, Login, Register, ChangePassword, ResetPassword, ForgotPassword } from "@/modules/auth/interfaces";
import type { User } from "@/modules/user/interfaces";

export const  useAuth = () => {
    const userStore = useAuthStore();


    const login = async (loginData : Login): Promise<void> => {
        const data: LoginResponse = await loginAction(loginData);
        userStore.setToken(data.token);
        userStore.setRefreshToken(data.refreshToken);

    };


    const register = (registerData : Register): Promise<User> => {
        return registerAction(registerData);
    };


    const changePassword = (putData : ChangePassword): Promise<void> => {
        return changePasswordAction(putData);
    };


    const forgotPassword = (forgotData : ForgotPassword): Promise<void> => {
        return forgotPasswordAction(forgotData);
    };


    const resetPassword = (resetData : ResetPassword): Promise<void> => {
        return resetPasswordAction(resetData);
    };


    return {
        login,
        register,
        changePassword,
        forgotPassword,
        resetPassword,
    };

};