<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useReservation } from '@/composables/useReservation';
import BookingCard from '@/components/BookingCard.vue';
import { BaseButton, BaseCard, BaseDateSelector } from 'ui';
import type { Reservation, ReservationDataDialog } from '../interfaces';
import { ReservationStatus } from '../interfaces';
import ReservationSummary from '@/components/ReservationSummary.vue';
import { useToast } from 'primevue/usetoast';
import { calculateDuration } from '@/helpers/dateHelpers';

const { userReservations, isLoading, cancelReservation } = useReservation();
const reservationDialogRef = ref();
const toast = useToast();
const selectedReservation = ref<Reservation | null>(null);

const year = new Date().getFullYear();
const dates = ref([new Date(year, 0, 1), new Date(year, 11, 31)]);

const totalSpent = computed(() => 
    userReservations.value.reduce((acc, res) => acc + (res.price.totalPrice || 0), 0).toFixed(2)
);

const totalMatches = computed(() => userReservations.value.length);

const FINAL_STATUS_IDS = [
    ReservationStatus.Cancelled,
    ReservationStatus.Completed,
    ReservationStatus.Failed,
    ReservationStatus.Refunded
];


const canCancelReservation = computed(() => {
    if (!selectedReservation.value) return false;
    const statusId = selectedReservation.value.status.id;
    return !FINAL_STATUS_IDS.includes(statusId);
});

const statsWidgets = computed(() => [
    {
        label: 'Tiempo en pista',
        value: formattedTimePlayed.value,
        icon: 'pi pi-stopwatch',
        color: 'text-[#94C8E7]'
    },
    {
        label: 'Inversión total',
        value: `${totalSpent.value}€`,
        icon: 'pi pi-wallet',
        color: 'text-[#94C8E7]'
    },
    {
        label: 'Partidos',
        value: totalMatches.value,
        icon: 'pi pi-calendar',
        color: 'text-[#94C8E7]'
    },
    {
        label: 'Club Favorito',
        value: favouriteClub.value,
        icon: 'pi pi-calendar',
        color: 'text-[#94C8E7]'
    }

]);

const totalMinutesPlayed = computed(() => {
    return userReservations.value.reduce((total, res) => {
        const [startH, startM] = res.startTime.split(':').map(Number);
        const [endH, endM] = res.endTime.split(':').map(Number);
        
        const startInMinutes = startH! * 60 + startM!;
        const endInMinutes = endH! * 60 + endM!;
        
        return total + (endInMinutes - startInMinutes);
    }, 0);
});


const formattedTimePlayed = computed(() => {
    const hours = Math.floor(totalMinutesPlayed.value / 60);
    const mins = totalMinutesPlayed.value % 60;
    return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
});


const openReservationDetail = (reservation : Reservation) => {

    selectedReservation.value = reservation;

    const summarizedReservation: ReservationDataDialog = {
        id: reservation.id,
        userId: reservation.userId,
        clubId: reservation.clubId,
        courtId: reservation.courtId,
        courtName: reservation.courtId,
        type: reservation.courtId,
        clubName: reservation.clubId,
        clubAddress: reservation.clubId,
        date: reservation.date.toLocaleDateString('sv-SE'),
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.status.status,
        duration: calculateDuration(reservation.startTime, reservation.endTime),
        price: reservation.price,
        createdAt: reservation.createdAt
    };
   reservationDialogRef.value.open(summarizedReservation);
}




const favouriteClub = computed(() => {
    if (!userReservations.value || userReservations.value.length === 0) return '—';

    const counts = userReservations.value.reduce((acc, res) => {
        const name = res.clubId || 'Club Desconocido';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const keys = Object.keys(counts);
    if (keys.length === 0) return '-';

    return keys.reduce((a, b) => {
        return (counts[a] ?? 0) > (counts[b] ?? 0) ? a : b;
    });

});


const handleCancelReservation = async(reservationId : number) => {
    try {
        await cancelReservation(reservationId);
        toast.add({ severity: 'success', summary: 'Confirmado', detail: 'Reserva anulada', life: 3000});
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 
        });
    }
}

watch(dates, async (newDates) => {
    console.log("Buscando disponibilidad para", newDates); 
    //TODO endpoint de disponibilidad al cambiar la fecha en selector
});

</script>

<template>
    <div class="max-w-7xl mx-auto w-full flex-1 px-6 py-8 flex flex-col gap-8">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-800">Mi Historial</h1>
                <p class="text-slate-500">Consulta reservas pasadas y futuras</p>
            </div>
            
        </div>

        <BaseDateSelector
            v-model="dates"
            title="Filtrar tus reservas"
            subtitle="Consulta en un rango de fechas" 
            selectionMode="range" 
            :manualInput="false"
            :showTime="false"
            placeholder="Fecha inicio - Fecha fin"
        />
        
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BaseCard v-for="widget in statsWidgets" :key="widget.label" padding="p-5" class="!shadow-md">
                <div class="flex items-center gap-3 mb-2">
                    <i :class="[widget.icon, 'p-2', widget.color ]"></i>
                    <span class="text-sm font-medium text-slate-500"> {{ widget.label }}</span>
                </div>
                <p class="text-2xl font-black text-slate-900">{{ widget.value }}</p>
            </BaseCard>
        </section>

        
        <section class="space-y-4">
            <div v-if="isLoading" class="space-y-4">
                <p>Cargando tus reservas...</p>
            </div>

            <template v-else-if="userReservations.length > 0">
                <BookingCard
                    v-for="res in userReservations" 
                    :key="res.id" 
                    :reservation="res"
                    @click="openReservationDetail(res)"
                    class="hover:cursor-pointer"
                />
            </template>

            <div v-else class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <i class="pi pi-calendar-times text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500 font-medium">No se han encontrado reservas en este periodo.</p>
            </div>
        </section>

        <BaseDialog
            ref="reservationDialogRef"
            header="Resumen de la reserva"
            >
            <template #default="{ data }">
                <ReservationSummary :reservation="data"/>
            </template>

            <template #footer="{ data }">
                <BaseButton label="Volver" severity="secondary" @click="reservationDialogRef.close"/>
                <BaseButton v-if="canCancelReservation" label="Anular reserva" severity="danger" @click="handleCancelReservation(data.id)" />
            </template>
        </BaseDialog>
    </div>
</template>