<script setup lang="ts">
import { getErrorMessage, isHandledError } from '@/api/errorsApi';
import { RouteNames } from '@/router/routeNames';
import { ConfirmCard } from 'ui';

const props = defineProps<{
    token: string;
    email: string;
}>();

const toast = useToast();
const { resendConfirmation, confirmEmail } = useAuth();
const router = useRouter();
const status = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref('');
const isResending = ref(false);

onMounted(async () => {
    try {
        await confirmEmail({ token: props.token, email: props.email });
        status.value = 'success';
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        status.value = 'error';
        const message = getErrorMessage(error);
        errorMessage.value= message;
    }
});

const onResend = async () => {
    isResending.value = true;
    try {
        await resendConfirmation(props.email);
        toast.add({ severity: 'success', summary: 'Email enviado', detail: 'Si el email existe, recibirás un nuevo enlace en tu bandeja de entrada', life: 2000 });

        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push({ name: RouteNames.LOGIN });
    } catch (error:unknown){
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
    } finally {
        isResending.value = false;
    }
};

</script>

<template>
    <BlockUI :blocked="isResending" fullScreen />
    <div class="flex items-center">
        <div class="w-full max-w-md">
            <ConfirmCard
                :status="status"
                title-message="¡Email confirmado!"
                message-confirmation="Tu cuenta está activa. Ya puedes iniciar sesión"
                return-label="Ir al inicio de sesión"
                icon-button-success="pi pi-sign-in"
                error-title="Enlace no válido"
                :error-message="errorMessage"
                back-label="Reenviar enlace de confirmación"
                @go-to="router.push({ name: RouteNames.LOGIN})"
                @back="onResend"
            />
        </div>
    </div>
</template>
