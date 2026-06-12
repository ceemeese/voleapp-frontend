import { changePasswordAction, forgotPasswordAction, loginAction, registerAction, resetPasswordAction } from "@/modules/auth/actions"; 
import { useAuthStore } from "@/stores/authStore"
import { ref } from "vue";
import type { LoginResponse, Login, Register, ChangePassword, ResetPassword, ForgotPassword } from "@/modules/auth/interfaces";
import type { User } from "@/modules/user/interfaces";

export const  useAuth = () => {
    const userStore = useAuthStore();
    const isLoading = ref<boolean>(false);

    
    const login = async (loginData : Login): Promise<void> => {
        isLoading.value = true;

        try {
            const data: LoginResponse = await loginAction(loginData);
            userStore.setToken(data.token);
            userStore.setRefreshToken(data.refreshToken);
        } finally {
            isLoading.value = false;
        }
    };


    const register = async (registerData : Register): Promise<User> => {
        isLoading.value = true;

        try {
            const data: User = await registerAction(registerData);
            return data;
        } finally {
            isLoading.value = false;
        }
    };


    const changePassword = async (putData : ChangePassword): Promise<void> => {
        isLoading.value = true;

        try {
            await changePasswordAction(putData);
        } finally {
            isLoading.value = false;
        }
    };


    const forgotPassword = async (forgotData : ForgotPassword): Promise<void> => {
        isLoading.value = true;

        try {
            await forgotPasswordAction(forgotData);
        } finally {
            isLoading.value = false;
        }
    };


    const resetPassword = async (resetData : ResetPassword): Promise<void> => {
        isLoading.value = true;

        try {
            await resetPasswordAction(resetData);
        } finally {
            isLoading.value = false;
        }
    };


    return {
        isLoading,
        login,
        register,
        changePassword,
        forgotPassword,
        resetPassword,
    };

};