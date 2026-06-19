<script setup lang="ts">
import type { OccupancyResponse } from '../interfaces';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const occupancyData = ref<OccupancyResponse>();
const { getOccupancyStats } = useAnalytics();

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const selectedYear = ref<number>(currentYear);
const selectedMonth = ref<number>(currentMonth);

const loadOccupancy = async () => {

    try {
        occupancyData.value = await getOccupancyStats(selectedYear.value, selectedMonth.value)
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error',summary: 'Error',detail: message,life: 2000 })
    }
}


const courtChartData = computed(() => {
    if (!occupancyData.value?.occupancyByCourt) return { labels: [], datasets: [] };
    
    const courts = occupancyData.value.occupancyByCourt;
    
    return {
        labels: courts.map(c => c.courtName),
        datasets: [
            {
                data: courts.map(c => c.occupancyRate),
                
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'],
                borderWidth: 0
            }
        ]
    };
});

const dayChartData = computed(() => {
    if (!occupancyData.value?.occupancyByDayOfWeek) return { labels: [], datasets: [] };
    
    const days = occupancyData.value.occupancyByDayOfWeek;
    
    return {
        labels: days.map(d => d.dayName),
        datasets: [
            {
                label: 'Porcentaje de Ocupación',
                data: days.map(d => d.occupancyRate),
                backgroundColor: '#3b82f6',
                borderRadius: 4,
                barThickness: 16
            }
        ]
    };
});


const dayChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { 
            beginAtZero: true, 
            max: 100,
            ticks: { callback: (value: number) => value + '%' }
        },
        y: { grid: { display: false } }
    }
};


const donutOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { boxWidth: 12, font: { weight: '500' } }
        }
    }
};

const evolutionChartData = computed(() => {
    if (!occupancyData.value?.occupancyEvolution) return { labels: [], datasets: [] };

    const evolution = occupancyData.value.occupancyEvolution;

    return {
        labels: evolution.map(e => e.monthName),
        datasets: [
            {
                label: 'Tasa de Ocupación',
                data: evolution.map(e => e.occupancyRate),
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderColor: '#1e293b',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1e293b',
                pointRadius: 4
            }
        ]
    };
});


const evolutionChartOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: { grid: { display: false } },
        y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value: number) => value + '%' },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
        }
    }
};

onMounted(async () => {
    await loadOccupancy();
});

watch([selectedYear, selectedMonth], async () => {
    await loadOccupancy();
});
        

</script>

<template>
    <div class="flex flex-col p-6 space-y-6 w-full h-full overflow-y-auto md:overflow-y-hidden">
        
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Ocupación</h2>
                <p class="text-sm text-slate-500">Histórico y rendimiento mensual del club</p>
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


        <div class="flex flex-col gap-5 md:overflow-y-auto">
            <section v-if="occupancyData" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <BaseCard padding="p-5" class="!shadow-md">
                    <div class="mb-2">
                        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                            <i class="pi pi-chart-pie text-purple-500"></i>
                            Uso por Pistas
                        </h3>
                        <p class="text-xs text-slate-400">Distribución de reservas e impacto de cada pista del club</p>
                    </div>
                    <div class="h-64 w-full mt-4 flex justify-center items-center">
                        <Chart type="doughnut" :data="courtChartData" :options="donutOptions" class="h-full w-full" />
                    </div>
                </BaseCard>


                <BaseCard padding="p-5" class="!shadow-md">
                    <div class="mb-2">
                        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                            <i class="pi pi-calendar text-blue-500"></i>
                            Rendimiento Semanal
                        </h3>
                        <p class="text-xs text-slate-400">Días con mayor y menor afluencia de jugadores en el periodo</p>
                    </div>
                    <div class="h-64 w-full mt-4">
                        <Chart type="bar" :data="dayChartData" :options="dayChartOptions" class="h-full w-full" />
                    </div>
                </BaseCard>

                <div class="md:col-span-2">
                    <BaseCard padding="p-5" class="!shadow-md mb-2">
                        <div class="mb-2">
                            <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                                <i class="pi pi-chart-line text-emerald-500"></i>
                                Tendencia de Ocupación Mensual
                            </h3>
                            <p class="text-xs text-slate-400">Evolución porcentual del llenado de pistas a lo largo del año</p>
                        </div>
                        <div class="h-72 w-full mt-4">
                            <Chart type="line" :data="evolutionChartData" :options="evolutionChartOptions" class="h-full w-full" />
                        </div>
                    </BaseCard>
                </div>

            </section> 
        </div>
    </div>
</template>