import { loginAction, type LoginResponse } from "@/modules/auth/actions/login.action";
import { registerAction } from "@/modules/auth/actions/register.action";
import type { Login, Register } from "@/modules/auth/api/auth";
import { useUserStore } from "@/stores/userStore"
import { ref } from "vue";

export const  useAuth = () => {
    const userStore = useUserStore();
    const isLoading = ref(false);

    
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


    const register = async (registerData : Register): Promise<void> => {
        isLoading.value = true;

        try {
            await registerAction(registerData);
        } finally {
            isLoading.value = false;
        }
    };


    return {
        isLoading,
        login,
        register,
    };


};