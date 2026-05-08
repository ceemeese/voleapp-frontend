<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useToast } from 'primevue/usetoast';
import type { LoginValues } from 'ui';
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const router = useRouter();
const userStore = useAuthStore();
const { login, isLoading} = useAuth();

const onLoginSubmit = async (formData: LoginValues) => {
    try {
        await login(formData);
        toast.add({
        severity: 'success',
        summary: '¡Bienvenido!', 
        detail: 'Has iniciado sesión correctamente', 
        life: 3000
        })
        await new Promise(resolve => setTimeout(resolve, 2000))

        if (userStore.isAdmin || userStore.isSuperadmin) {
            router.push({ name: 'admin' });
        } else {
            router.push({ name: 'user-home' });
        }  

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 5000 });
    }
};
</script>


<template>
    <div class="flex items-center">
        <div class="w-full max-w-md">
            <LoginForm :loading="isLoading" @submit="onLoginSubmit"/>
        </div>
    </div>
</template>