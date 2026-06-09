<script setup lang="ts">
import type { GlobalAnalyticsResponse } from '../interfaces';

const toast = useToast();
const { getGlobalAnalyticsStats } = useAnalytics();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const selectedYear = ref<number>(currentYear);
const selectedMonth = ref<number>(currentMonth);

const analyticsData = ref<GlobalAnalyticsResponse>();


const loadAnalytics = async () => {

    try {
        analyticsData.value = await getGlobalAnalyticsStats(selectedYear.value, selectedMonth.value);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error',summary: 'Error',detail: message, life: 3000 })
    }
}


const financialChartData = computed(() => {
    if (!analyticsData.value?.monthlyEvolution) {
        return { labels: [], datasets: [] };
    }

    const evolution = analyticsData.value.monthlyEvolution;

    return {
        labels: evolution.map(item => item.month),
        datasets: [
            {
                label: 'Ganancias (€)',
                data: evolution.map(item => item.totalRevenue),
                backgroundColor: '#10b981', 
                borderColor: '#10b981',                     
                borderWidth: 2,
                tension: 0.4, 
                type: 'line',
                yAxisID: 'yRevenue',
            },
            {
                label: 'Reservas Totales',
                data: evolution.map(item => item.totalReservations),
                backgroundColor: 'rgba(51, 65, 85, 0.15)',
                borderColor: '#334155',
                borderWidth: 1,
                borderRadius: 4,
                type: 'bar',
                yAxisID: 'yReservations',
            }
        ]
    };
});


const growthChartData = computed(() => {
    if (!analyticsData.value?.monthlyEvolution) {
        return { labels: [], datasets: [] };
    }

    const evolution = analyticsData.value.monthlyEvolution;

    return {
        labels: evolution.map(item => item.month),
        datasets: [
            {
                label: 'Clubes',
                data: evolution.map(item => item.totalClubs),
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                borderWidth: 1,
                borderRadius: 4,
                type: 'bar',
                yAxisID: 'yClubs',
            },
            {
                label: 'Jugadores',
                data: evolution.map(item => item.totalPlayers),
                backgroundColor: '#a855f7',
                borderColor: '#a855f7',
                borderWidth: 1,
                borderRadius: 4,
                type: 'bar',
                yAxisID: 'yPlayers',
            }
        ]
    };
});


const financialChartOptions = computed(() => {
    return {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { boxWidth: 12, font: { size: 12, weight: '500' }, color: '#334155' }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            yRevenue: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => value + '€',
                    color: '#10b981'
                },
                grid: { color: 'rgba(226, 232, 240, 0.6)' }
            },
            yReservations: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                ticks: { color: '#334155' },
                grid: { display: false }
            }
        }
    };
});


const growthChartOptions = computed(() => {
    return {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { boxWidth: 12, font: { size: 12, weight: '500' }, color: '#334155' }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            
            yClubs: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                ticks: { 
                    color: '#f59e0b',
                    stepSize: 1
                },
                grid: { color: 'rgba(226, 232, 240, 0.6)' }
            },
            
            yPlayers: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                ticks: { 
                    color: '#a855f7',
                    stepSize: 1
                },
                grid: { display: false }
            }
        }
    };
});


onMounted(async () => {
    await loadAnalytics();
})

watch([selectedYear, selectedMonth], async () => {
    await loadAnalytics();
});

</script>

<template>
    <div class="flex flex-col p-6 space-y-6 w-full h-full overflow-y-auto">
        
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Analíticas del Negocio</h2>
                <p class="text-sm text-slate-500">Histórico de rendimiento, altas y evolución de la plataforma</p>
            </div>
            
            <div class="w-full md:w-auto md:min-w-[320px]">
                <div class="grid grid-cols-2 gap-3 w-full">
                    <BaseInput
                        v-model="selectedMonth"
                        type="select"
                        label="Mes"
                        :options="MONTHS_OPTIONS"
                        option-label="label"
                        option-value="value"
                    />

                    <BaseInput
                        v-model="selectedYear"
                        type="select"
                        label="Año"
                        :options="YEARS_OPTIONS"
                        option-label="label"
                        option-value="value"
                    />
                </div>
            </div>
        </div>

        <section v-if="analyticsData" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            
            <BaseCard padding="p-6" class="border-l-4 border-l-emerald-500 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ganancias Periodo</p>
                <p class="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-2 truncate">
                    {{ analyticsData.totalRevenuePeriod.toLocaleString('es-ES') }}€
                </p>
                <p class="text-xs text-slate-400 mt-2">Facturación total de clubs acumulada</p>
            </BaseCard>

            <BaseCard padding="p-6" class="border-l-4 border-l-slate-800 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Reservas Periodo</p>
                <p class="text-xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">
                    {{ analyticsData.totalReservationsPeriod.toLocaleString('es-ES') }}
                </p>
                <p class="text-xs text-slate-400 mt-2">Partidos reservados en el sistema</p>
            </BaseCard>

            <BaseCard padding="p-6" class="border-l-4 border-l-blue-500 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Media Reservas / Club</p>
                <p class="text-xl sm:text-3xl font-extrabold text-blue-600 mt-2 truncate">
                    {{ analyticsData.averageReservationsPerClub }}
                </p>
                <p class="text-xs text-slate-400 mt-2">Ratio de uso por centro deportivo</p>
            </BaseCard>

            <BaseCard padding="p-6" class="border-l-4 border-l-amber-500 shadow-sm xl:col-span-1">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nuevos Clubes Afiliados</p>
                <p class="text-xl sm:text-3xl font-extrabold text-amber-600 mt-2 truncate">
                    +{{ analyticsData.totalClubsPeriod }}
                </p>
                <p class="text-xs text-slate-400 mt-2">Centros dados de alta en este periodo</p>
            </BaseCard>

            <BaseCard padding="p-6" class="border-l-4 border-l-purple-500 shadow-sm xl:col-span-1">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nuevos Usuarios Registrados</p>
                <p class="text-xl sm:text-3xl font-extrabold text-purple-600 mt-2 truncate">
                    +{{ analyticsData.totalNewPlayersCount.toLocaleString('es-ES') }}
                </p>
                <p class="text-xs text-slate-400 mt-2">Nuevas cuentas de jugadores creadas</p>
            </BaseCard>

        </section>

        <section v-if="analyticsData" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            <BaseCard padding="p-5">
                <div class="flex flex-col justify-between h-[380px]">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                        <i class="pi pi-chart-line"></i>
                        Rendimiento Financiero y Reservas
                    </h3>
                    
                    <div class="h-80 w-full">
                        <Chart type="bar" :data="financialChartData" :options="financialChartOptions" class="h-full w-full" />
                    </div>
                </div>
            </BaseCard>

            <BaseCard padding="p-5">
                <div class="flex flex-col justify-between h-[380px]">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                        <i class="pi pi-user-plus"></i>
                        Evolución de Altas
                    </h3>
    
                    <div class="h-80 w-full">
                        <Chart type="bar" :data="growthChartData" :options="growthChartOptions" class="h-full w-full" />
                    </div>
                </div>
            </BaseCard>

        </section>
    </div>
</template>