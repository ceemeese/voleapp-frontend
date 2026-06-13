<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { RegisterValues } from 'ui';

const toast = useToast();
const router = useRouter();
const { register } = useAuth();
const { isLoading } = useGlobalLoading();
const isLoadingLayout = ref<boolean>(false);

const onRegisterSubmit = async (formData: RegisterValues) => {
    isLoadingLayout.value = true;
    try {
        await register(formData);
        toast.add({ severity: 'success',summary: '¡Bienvenido!', detail: 'Registro realizado', life: 2000})

        await new Promise(resolve => setTimeout(resolve, 2000))
        isLoadingLayout.value = false;
        router.push({ name: RouteNames.LOGIN });
    } catch (error: unknown) {
        isLoadingLayout.value = false;
        const message = error instanceof Error ? error.message : 'Error';
        toast.add({ severity: 'error', summary: 'Error de registro', detail: message, life: 2000 });
    }
};
</script>


<template>
    <BlockUI 
        :blocked="isLoadingLayout"
        fullScreen
        :autoZIndex="true" 
        :baseZIndex="9999"
    />

    <div class="flex items-center">
            <div class="w-full max-w-md">

                <RegisterForm 
                    :loading="isLoading"
                    @submit="onRegisterSubmit"
                />
            
            </div>
    </div>

</template>

<style scoped>

</style>