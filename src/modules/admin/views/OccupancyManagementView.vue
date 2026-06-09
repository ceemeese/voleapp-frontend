<script setup lang="ts">
import type { ColumnConfig } from 'ui';
import type { GlobalOccupancyResponse } from '../interfaces';

const toast = useToast();
const occupancyData = ref<GlobalOccupancyResponse>();
const { getGlobalOccupancyStats } = useAnalytics();

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const selectedYear = ref<number>(currentYear);
const selectedMonth = ref<number>(currentMonth);

const loadOccupancy = async () => {
    try {
        occupancyData.value = await getGlobalOccupancyStats(selectedYear.value, selectedMonth.value);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error',summary: 'Error',detail: message,life: 3000 });
    }
};


const dayChartData = computed(() => {
    if (!occupancyData.value?.occupancyByDayOfWeek) return { labels: [], datasets: [] };
    
    const days = occupancyData.value.occupancyByDayOfWeek;
    return {
        labels: days.map(d => d.dayName),
        datasets: [{
            label: 'Ocupación (%)',
            data: days.map(d => d.occupancyRate),
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            borderColor: '#3b82f6',
            borderWidth: 1.5,
            borderRadius: 4
        }]
    };
});

const dayChartOptions = computed(() => ({
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b' } },
        y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value: number) => value + '%', color: '#64748b' },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
        }
    }
}));

const evolutionChartData = computed(() => {
    if (!occupancyData.value?.occupancyEvolution) return { labels: [], datasets: [] };
    
    const evolution = occupancyData.value.occupancyEvolution;
    return {
        labels: evolution.map(e => e.monthName),
        datasets: [{
            label: 'Ocupación Media Global',
            data: evolution.map(e => e.occupancyRate),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderWidth: 2.5,
            tension: 0.35,
            fill: true
        }]
    };
});

const evolutionChartOptions = computed(() => ({
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b' } },
        y: {
            beginAtZero: true,
            max: 100,
            ticks: { 
                stepSize: 20, 
                callback: (value: number) => value + '%',
                color: '#64748b' 
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
        }
    }
}));

const rankingColumns : ColumnConfig<GlobalOccupancyResponse>[]= [
  { field: 'position', header: 'Pos', sortable: false },
  { field: 'clubName', header: 'Club', sortable: false },
  { field: 'occupancyRate', header: 'Ocupación', sortable: false }
];

const formattedClubRanking = computed(() => {
    if (!occupancyData.value?.occupancyByClub) return [];
    return occupancyData.value.occupancyByClub.map((club, index) => ({
        ...club,
        position: index + 1
    }));
});


onMounted(async () => {
    await loadOccupancy();
});

watch([selectedYear, selectedMonth], async () => {
    await loadOccupancy();
});

</script>

<template>
    <div class="flex flex-col p-6 space-y-6 w-full h-full overflow-y-auto">
        
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2 border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Ocupación General</h2>
                <p class="text-sm text-slate-500">Histórico y rendimiento</p>
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

        <section v-if="occupancyData" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <BaseCard padding="p-5" class="shadow-sm">
  
                <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                    <i class="pi pi-trophy"></i>
                    Ranking de Ocupación por Clubes
                </h3>

                <div class="max-h-[350px] overflow-y-auto">
                    <BaseDataTable
                        :value="formattedClubRanking"
                        :columns="rankingColumns"
                        :show-search="false"
                        :paginator="false"
                        :rows="5"
                    >
                        <template #position="{ data }">
                            <div class="flex justify-center">
                                <span class="text-slate-400 font-medium text-xs">
                                    {{ data.position }}
                                </span>
                            </div>
                        </template>

                        <template #clubName="{ data }">
                            <span class="font-semibold text-slate-700">
                                {{ data.clubName }}
                            </span>
                        </template>

                        <template #occupancyRate="{ data }">
                            <span class="inline-block px-2 py-0.5 text-xs font-bold rounded-xl border bg-slate-100 text-slate-500 border-slate-200 ">
                                {{ data.occupancyRate }}%
                            </span>
                        </template>
                    </BaseDataTable>
                </div>
            </BaseCard>
            

            <BaseCard padding="p-5" class="shadow-sm">
                <div class="mb-2">
                    <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                        <i class="pi pi-calendar"></i>
                        Rendimiento Semanal
                    </h3>
                    <p class="text-xs text-slate-400">Días con mayor y menor afluencia de jugadores en el periodo</p>
                </div>
                <div class="h-64 w-full mt-4">
                    <Chart type="bar" :data="dayChartData" :options="dayChartOptions" class="h-full w-full" />
                </div>
            </BaseCard>

            <div class="md:col-span-2">
                <BaseCard padding="p-5" class="shadow-sm">
                    <div class="mb-2">
                        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                            <i class="pi pi-chart-line"></i>
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
</template>