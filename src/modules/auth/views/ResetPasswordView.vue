<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { resetSchema } from '@/modules/auth/schemas/reset.schema';
import { ResetPasswordForm, type ResetPasswordValues } from 'ui';
import type { ResetPassword } from '@/modules/auth/interfaces';

const props = defineProps<{
  token: string;
  email: string;
}>();

const isProcessing = ref<boolean>(false);

const toast = useToast();
const router = useRouter();
const { resetPassword, isLoading } = useAuth();

const resolver = zodResolver(resetSchema);

const onResetPasswordSubmit = async (formData : ResetPasswordValues ) => {
    isProcessing.value = true;

    try {

        const requestBody : ResetPassword = {
            email: props.email,
            token: props.token,
            newPassword: formData.newPassword
        }

        await resetPassword(requestBody);
        
        toast.add({ severity: 'success', summary: 'Contraseña actualizada', detail: `TodoOK`, life: 3000 });

        await new Promise(resolve => setTimeout(resolve, 2000))
        router.push({ name: RouteNames.LOGIN });
        isProcessing.value = false;

    } catch (error: unknown) {
        isProcessing.value = false;
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
};


</script>

<template>
    <BlockUI :blocked="isProcessing" fullScreen />
    <div class="flex items-center">
        <div class="w-full max-w-md">
            <ResetPasswordForm
                :loading="isLoading"
                @submit="onResetPasswordSubmit"
                :resolver="resolver"
            />
        </div>
    </div>
</template>