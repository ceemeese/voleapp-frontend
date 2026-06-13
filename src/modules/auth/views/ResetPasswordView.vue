<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { resetSchema } from '@/modules/auth/schemas/reset.schema';
import { ResetPasswordForm, type ResetPasswordValues } from 'ui';
import type { ResetPassword } from '@/modules/auth/interfaces';

const props = defineProps<{
  token: string;
  email: string;
}>();

const { isLoading } = useGlobalLoading();
const isLoadingLayout = ref<boolean>(false);

const toast = useToast();
const router = useRouter();
const { resetPassword } = useAuth();

const resolver = zodResolver(resetSchema);

const onResetPasswordSubmit = async (formData : ResetPasswordValues ) => {
    isLoadingLayout.value = true;
    try {

        const requestBody : ResetPassword = {
            email: props.email,
            token: props.token,
            newPassword: formData.newPassword
        }

        await resetPassword(requestBody);
        
        toast.add({ severity: 'success', summary: 'Contraseña actualizada', detail: `Ya puedes iniciar sesión con tu nueva clave`, life: 2000 });

        await new Promise(resolve => setTimeout(resolve, 2000))
        isLoadingLayout.value = false;
        router.push({ name: RouteNames.LOGIN });

    } catch (error: unknown) {
        isLoadingLayout.value = false;
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
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
            <ResetPasswordForm
                card
                mode="reset"
                :loading="isLoading"
                @submit="onResetPasswordSubmit"
                :resolver="resolver"
            />
        </div>
    </div>
</template>