<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';
import { ConfirmCard } from 'ui';

const route = useRoute();
const router = useRouter();
const { confirmPayment, cancelReservation } = useReservation();
const status = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref('');

onMounted(async () => {
    const reservationId = Number(route.query.reservationId);
    const sessionId = route.query.session_id as string;
    const cancelled = route.query.cancelled === 'true';

    if (cancelled) {
        if (reservationId) {
            try { await cancelReservation(reservationId); } catch {}
        }
        status.value = 'error';
        errorMessage.value = 'El pago no se ha completado. La reserva ha sido cancelada.';
        return;
    }

    if (!reservationId || !sessionId) {
        status.value = 'error';
        errorMessage.value = 'Parámetros de pago no válidos';
        return;
    }

    try {
        await confirmPayment(reservationId, sessionId);
        status.value = 'success';
    } catch (error: unknown) {
        status.value = 'error';
        if (!isHandledError(error)) errorMessage.value = getErrorMessage(error);
    }
});
</script>

<template>
    <div class="flex items-center">
        <div class="w-full max-w-md">
            <ConfirmCard
                :status="status"
                title-message="¡Pago completado!"
                message-confirmation="Tu reserva ha sido confirmada. Recibirás un email de confirmación."
                return-label="Ver mis reservas"
                icon-button-success="pi pi-calendar"
                error-title="Error al confirmar el pago"
                :error-message="errorMessage"
                back-label="Volver al inicio"
                @go-to="router.push({ name: RouteNames.USER_RESERVATIONS })"
                @back="router.push({ name: RouteNames.USER_HOME })"
            />
        </div>
    </div>
</template>
