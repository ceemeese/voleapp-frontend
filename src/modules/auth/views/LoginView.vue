<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { LoginValues } from 'ui';
import { loginSchema } from '../schemas/login.schema';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const router = useRouter();
const userStore = useAuthStore();
const { login } = useAuth();
const resolver = zodResolver(loginSchema);
const isLoadingLayout = ref<boolean>(false);


const onLoginSubmit = async (formData: LoginValues) => {
    isLoadingLayout.value = true;
    try {
        await login(formData);
        toast.add({ severity: 'success', summary: '¡Bienvenido!', detail: 'Has iniciado sesión correctamente', life: 2000})

        await new Promise(resolve => setTimeout(resolve, 2000))

        isLoadingLayout.value = false;

        if (userStore.isSuperadmin) {
            router.push({ name: RouteNames.MANAGEMENT_DASHBOARD });
        } else if (userStore.isAdmin) {
            router.push({ name: RouteNames.ADMIN_DASHBOARD });
        } else {
            router.push({ name: RouteNames.USER_HOME });
        }  
    } catch (error: unknown) {
        isLoadingLayout.value = false;
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    } finally {
        isLoadingLayout.value = false;
    }
};
</script>


<template>
    <BlockUI 
        :blocked="isLoadingLayout"
        fullScreen
    />

    <div class="flex items-center">
        <div class="w-full max-w-md">
            <LoginForm 
                @submit="onLoginSubmit"
                :register-route="RouteNames.REGISTER"
                :forgot-password-label="'¿Olvidaste tu contraseña?'"
                :forgot-password-route="RouteNames.FORGOT"
                :resolver="resolver"
                :loading="isLoadingLayout"
                />
        </div>
    </div>
</template>