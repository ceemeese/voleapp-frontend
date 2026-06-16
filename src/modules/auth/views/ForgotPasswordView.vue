<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { ForgotPasswordForm, type ForgotValues } from 'ui';
import { forgotSchema } from '../schemas/forgot.schema';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const { forgotPassword } = useAuth();
const { isLoading } = useGlobalLoading();
const resolver = zodResolver(forgotSchema);

const onForgotPasswordSubmit = async (formData : ForgotValues) => {
  try {
    await forgotPassword(formData);
    toast.add({ severity: 'info', summary: 'Solicitud enviada', detail: 'Si el correo es correcto, recibirás un enlace de recuperación en breve', life: 2000})
  } catch (error: unknown) {
    if (isHandledError(error)) return;
    const message = getErrorMessage(error);
    toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
  }
};
</script>


<template>
    <div class="flex items-center">
        <div class="w-full max-w-md">
            <ForgotPasswordForm 
                :loading="isLoading" 
                :back-route="RouteNames.LOGIN"
                @submit="onForgotPasswordSubmit"
                :resolver="resolver"
                />
        </div>
    </div>
</template>