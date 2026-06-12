<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { LoginValues } from 'ui';

const toast = useToast();
const router = useRouter();
const userStore = useAuthStore();
const { login, isLoading } = useAuth();

const onLoginSubmit = async (formData: LoginValues) => {
    try {
        await login(formData);
        toast.add({ severity: 'success', summary: '¡Bienvenido!', detail: 'Has iniciado sesión correctamente', life: 3000})
        await new Promise(resolve => setTimeout(resolve, 2000))

        if (userStore.isSuperadmin) {
            router.push({ name: RouteNames.MANAGEMENT_DASHBOARD });
        } else if (userStore.isAdmin) {
            router.push({ name: RouteNames.ADMIN_DASHBOARD });
        } else {
            router.push({ name: RouteNames.USER_HOME });
        }  

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 });
    }
};
</script>


<template>
    <BlockUI :blocked="isLoading" fullScreen />
    <div class="flex items-center">
        <div class="w-full max-w-md">
            <LoginForm 
                :loading="isLoading" 
                @submit="onLoginSubmit"
                :register-route="RouteNames.REGISTER"
                :forgot-password-label="'¿Olvidaste tu contraseña?'"
                :forgot-password-route="RouteNames.FORGOT"/>
        </div>
    </div>
</template>