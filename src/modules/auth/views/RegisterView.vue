<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { RegisterValues } from 'ui';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const router = useRouter();
const { register } = useAuth();
const isLoadingLayout = ref<boolean>(false);

const onRegisterSubmit = async (formData: RegisterValues) => {
    isLoadingLayout.value = true;
    try {
        await register(formData);
        toast.add({ severity: 'success', summary: '¡Registro completado!', detail: 'Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada', life: 2000 })

        await new Promise(resolve => setTimeout(resolve, 2000))
        isLoadingLayout.value = false;
        
        router.push({ name: RouteNames.LOGIN });
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error', summary: 'Error de registro', detail: message, life: 2000 });
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
                <RegisterForm 
                    :loading="isLoadingLayout"
                    @submit="onRegisterSubmit"
                />
            </div>
    </div>

</template>

<style scoped>

</style>