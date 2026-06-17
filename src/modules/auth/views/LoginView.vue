<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { LoginValues } from 'ui';
import { loginSchema } from '../schemas/login.schema';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const router = useRouter();
const userStore = useAuthStore();
const { login, resendConfirmation } = useAuth();
const resolver = zodResolver(loginSchema);
const isLoadingLayout = ref<boolean>(false);
const showResendButton = ref<boolean>(false);
const resendEmail = ref<string>('');
const isResending = ref<boolean>(false);


const onLoginSubmit = async (formData: LoginValues) => {
    isLoadingLayout.value = true;
    showResendButton.value = false;
    try {
        await login(formData);
        toast.add({ severity: 'success', summary: '¡Bienvenido!', detail: 'Has iniciado sesión correctamente', life: 2000})

        await new Promise(resolve => setTimeout(resolve, 2000))

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
        if (message.includes('confirmar tu email')) {
            showResendButton.value = true;
            resendEmail.value = formData.username;
        }
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 4000 });
    } finally {
        isLoadingLayout.value = false;
    }
};

const onResendConfirmation = async () => {
    isResending.value = true;
    try {
        await resendConfirmation(resendEmail.value);
        toast.add({ severity: 'success', summary: 'Email enviado', detail: 'Si el email existe, recibirás el enlace de confirmación en tu bandeja de entrada', life: 4000 });
        showResendButton.value = false;
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el email, inténtalo de nuevo', life: 3000 });
    } finally {
        isResending.value = false;
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

            <div v-if="showResendButton" class="mt-4 text-center text-sm text-gray-500 flex flex-col items-center gap-2 md:flex-row md:justify-center">
                ¿No recibiste el email de confirmación?
                <BaseButton
                    @click="onResendConfirmation"
                    :disabled="isResending"
                    class="!font-medium !underline !ml-1"
                    :loading="isLoadingLayout"
                >
                    {{ isResending ? 'Enviando...' : 'Reenviar confirmación' }}
                </BaseButton>
            </div>
        </div>
    </div>
</template>
