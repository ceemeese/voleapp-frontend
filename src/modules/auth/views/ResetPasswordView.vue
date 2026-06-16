<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { resetSchema } from '@/modules/auth/schemas/reset.schema';
import { ResetPasswordForm, type ResetPasswordValues } from 'ui';
import type { ResetPassword } from '@/modules/auth/interfaces';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const props = defineProps<{
  token: string;
  email: string;
}>();

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
        router.push({ name: RouteNames.LOGIN });
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
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
            <ResetPasswordForm
                card
                mode="reset"
                :loading="isLoadingLayout"
                @submit="onResetPasswordSubmit"
                :resolver="resolver"
            />
        </div>
    </div>
</template>