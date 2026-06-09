<script setup lang="ts">
import type { AnalyticsResponse } from '../interfaces';

const toast = useToast();
const analyticsData = ref<AnalyticsResponse>();
const { getAnalyticsStats } = useAnalytics();

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const selectedYear = ref<number>(currentYear);
const selectedMonth = ref<number>(currentMonth);

const loadAnalytics = async () => {

    try {
        analyticsData.value = await getAnalyticsStats(selectedYear.value, selectedMonth.value);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error',summary: 'Error',detail: message,life: 3000 })
    }
}


const chartData = computed(() => {
    if (!analyticsData.value?.evolutionDate) {
        return { labels: [], datasets: [] };
    }

    const evolution = analyticsData.value.evolutionDate;

    const labels = evolution.map(item => item.monthName);
    
    const revenueData = evolution.map(item => item.totalRevenue);
    const reservationsData = evolution.map(item => item.totalReservations);

    return {
        labels,
        datasets: [
            {
                label: 'Ganancias (€)',
                data: revenueData,
                backgroundColor: '#10b981', 
                borderColor: '#10b981',                     
                borderWidth: 1,
                tension: 0.5, 
                type: 'line',
                yAxisID: 'yRevenue',
            },
            {
                label: 'Reservas Totales',
                data: reservationsData,
                backgroundColor: 'rgba(0, 0, 0, 0.60)',
                borderColor: '#000000',
                borderWidth: 1,
                borderRadius: 5,
                borderSkipped: false,
                type: 'bar',
                yAxisID: 'yReservations',
            }
        ]
    };
});


const chartOptions = computed(() => {
    return {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 12,
                    font: { size: 12, weight: '500' },
                    color: '#000000'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            
            yRevenue: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => value + '€',
                    color: '#000000'
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.6)'
                }
            },
            
            yReservations: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                ticks: {
                    color: '#334155'
                },
                grid: {
                    display: false
                }
            }
        }
    };
});

onMounted(async () => {
    await loadAnalytics();
});

watch([selectedYear, selectedMonth], async () => {
    await loadAnalytics();
});

</script>

<template>
    <div class="flex flex-col p-6 space-y-6 w-full h-full overflow-y-auto">
        
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 border-b border-slate-200 pb-5">

            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Analíticas</h2>
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

        <section v-if="analyticsData" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <BaseCard padding="p-5">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket promedio</p>
                <p class="text-xl sm:text-3xl font-extrabold text-blue-600 mt-2">
                {{ analyticsData.averageRevenuePeriod }}€
                </p>
            </BaseCard>

            <BaseCard padding="p-4">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nuevos usuarios Mensual</p>
                <p class="text-xl sm:text-3xl font-extrabold text-purple-600 mt-2">
                {{ analyticsData.totalNewUsersCount }}
                </p>
            </BaseCard>

            <BaseCard padding="p-5">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total reservas mensuales</p>
                <p class="text-xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {{ analyticsData.totalReservationsPeriod }}
                </p>
            </BaseCard>

            <BaseCard padding="p-5">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ganancias mensuales</p>
                <p class="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
                {{ analyticsData.totalRevenuePeriod }}€
                </p>
            </BaseCard>
        </section>

        <section v-if="analyticsData">
            <BaseCard padding="p-5">
                <div class="flex flex-col justify-between h-[380px]">
                    <h3 class="font-semibold mb-4 flex items-center gap-2">
                        <i class="pi pi-chart-line"></i>
                        Actividad Anual
                    </h3>
                    
                    <div class="h-80 w-full">
                        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
                    </div>
                </div>
            </BaseCard>
        </section>

    </div>
</template>