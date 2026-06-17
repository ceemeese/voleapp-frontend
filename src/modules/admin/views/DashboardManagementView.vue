<script setup lang="ts">
import type { GlobalDashboardResponse } from '../interfaces';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const { getGlobalDashboardStats } = useAnalytics();
const dashboardData = ref<GlobalDashboardResponse>();
const { isLoading } = useGlobalLoading();


const loadDashboard = async () => {

    try {
        dashboardData.value = await getGlobalDashboardStats();
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error',summary: 'Error', detail: message, life: 2000 })
    }
}

onMounted(async () => {
    await loadDashboard();
})

</script>


<template>
    <div class="flex flex-col p-6 space-y-8 w-full h-full overflow-y-auto">
        
        <div class="flex justify-between items-center border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Resumen Diario</h2>
                <p class="text-sm text-slate-500">Estado del club (hoy)</p>
            </div>
            
            <BaseButton 
                icon="pi pi-refresh"
                label="Actualizar"
                class="!bg-black !border-none"
                size="small"
                :disabled="isLoading"
                rounded
                @click="loadDashboard"
            />
        </div>

        <div v-if="dashboardData" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        
            <BaseCard padding="p-6">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ocupación Global Hoy</p>
                <p class="text-xl sm:text-3xl font-extrabold text-blue-600 mt-2">
                    {{ dashboardData.todayGlobalOccupancyRate }}%
                </p>
                <p class="text-xs text-slate-400 mt-2 xl:md-auto">Media de horas reservadas en sistema</p>
            </BaseCard>

            <BaseCard padding="p-6">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Clubs Activos Hoy</p>
                <p class="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
                    {{ dashboardData.totalActiveClubsToday }}
                </p>
                <p class="text-xs text-slate-400 mt-2 md:mt-auto">Centros con al menos 1 reserva hoy</p>
            </BaseCard>

            <BaseCard padding="p-5">

                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Club Líder de Hoy</p>
                <p class="text-xl sm:text-3xl font-extrabold text-amber-400 mt-2">
                    {{ dashboardData.topClubToday || 'Sin actividad' }}
                </p>

                <p class="text-xs text-slate-400 mt-2 md:mt-auto">El centro con más reservas</p>

            </BaseCard>

            <BaseCard padding="p-5">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clubes Afiliados</p>
                <p class="text-xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    {{ dashboardData.totalClubsInPlatform }} </p>
                <p class="text-xs text-slate-400 mt-2 md:mt-auto">Centros registrados en la plataforma</p>
            </BaseCard>

            <BaseCard padding="p-5">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Comunidad de Jugadores</p>
                <p class="text-xl sm:text-3xl font-extrabold text-purple-600 mt-2">
                    {{ dashboardData.totalPlayersInPlatform || 0 }}
                </p>
                <p class="text-xs text-slate-400 mt-2 md:mt-auto">Usuarios totales con cuenta activa</p>
            </BaseCard>

        </div>
    </div>
</template>