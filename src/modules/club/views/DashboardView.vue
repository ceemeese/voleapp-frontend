<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DashboardResponse } from '../interfaces';
import { useAnalytics } from '@/composables/useAnalytics';
import { useToast } from 'primevue/usetoast';
import { BaseCard } from 'ui';

const toast = useToast();
const metrics = ref<DashboardResponse>();
const { isLoading, getDashboardStats } = useAnalytics();


const loadMetrics = async () => {

    try {
        metrics.value = await getDashboardStats();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000
        })
    }
}

onMounted(async () => {
    await loadMetrics();
    console.log(metrics.value, 'METRICS')
});

</script>

<template>
  <div class="p-4 space-y-6 bg-slate-50 min-h-screen">
    
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-black text-slate-800 uppercase italic">Resumen Diario</h2>
        <p class="text-sm text-slate-500">Estado del club (hoy)</p>
      </div>
      
      <span v-if="isLoading" class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full animate-pulse font-medium">
        Sincronizando...
      </span>
    </div>

    <div v-if="metrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      
        <BaseCard padding="p-5">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ocupación Hoy</p>
            <p class="text-3xl font-extrabold text-blue-600 mt-2">
            {{ metrics.todayGlobalOccupancyRate }}%
            </p>
        </BaseCard>

        <BaseCard padding="p-5">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingresos Hoy</p>
            <p class="text-3xl font-extrabold text-emerald-600 mt-2">
            {{ metrics.todayRevenue }}€
            </p>
        </BaseCard>

        <BaseCard padding="p-5">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket Medio Hoy</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-2">
            {{ metrics.averageTicketToday }}€
            </p>
        </BaseCard>

        <BaseCard padding="p-5">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hora Punta</p>
            <p class="text-3xl font-extrabold text-purple-600 mt-2 truncate">
            {{ metrics.peakHourToday || 'N/A' }}
            </p>
        </BaseCard>

    </div>

    <div v-if="metrics" class="grid grid-cols-1 md:grid-cols-3 gap-5">
      
        <BaseCard>
            <div class="flex flex-col h-full justify-between">
                <div>
                    <p class="text-sm font-semibold text-slate-600">Reservas Totales</p>
                    <p class="text-xs text-slate-400 mt-0.5">Gestionadas hoy en el club</p>
                </div>
                <div class="flex items-baseline justify-between mt-4">
                    <span class="text-4xl font-black text-slate-900">
                    {{ metrics.todayTotalReservations }}
                    </span>
                    <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Activas
                    </span>
                </div>
            </div>
        </BaseCard>

        <BaseCard>
            <div class="flex flex-col h-full justify-between">
                <div>
                    <p class="text-sm font-semibold text-slate-600">Eventos de Club</p>
                    <p class="text-xs text-slate-400 mt-0.5">Torneos, americanas y escuelas</p>
                </div>
                <div class="flex items-baseline justify-between mt-4">
                    <span class="text-4xl font-black text-slate-900">
                    {{ metrics.todayTotalClubEvents }}
                    </span>
                    <span class="text-xs text-slate-400">Hoy</span>
                </div>
            </div>
        </BaseCard>

        <BaseCard>
            <div class="flex flex-col h-full justify-between">
                <div>
                    <p class="text-sm font-semibold text-slate-600">Reservas Canceladas</p>
                    <p class="text-xs text-slate-400 mt-0.5">Liberadas por los usuarios</p>
                </div>
                <div class="flex items-baseline justify-between mt-4">
                    <span class="text-4xl font-black text-rose-600">
                    {{ metrics.cancelledReservationsToday }}
                    </span>
                    <span 
                    :class="metrics.cancelledReservationsToday > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'"
                    class="text-xs font-medium px-2 py-0.5 rounded"
                    >
                    {{ metrics.cancelledReservationsToday > 0 ? 'Atención' : 'Sin alertas' }}
                    </span>
                </div>
            </div>
        </BaseCard>

    </div>
  </div>
</template>