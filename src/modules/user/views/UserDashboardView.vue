<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';

const userStore = useUserStore();
const { getUserReservations, userReservations } = useReservation();
const authStore = useAuthStore();
const activeUserId = authStore.userId;
const errorMessage = ref<string>('');
const toast = useToast();


const upcomingReservations = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userStore.reservations
        .filter(res => new Date(res.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});


const fetchUserReservations = async() => {
    if (userReservations.value.length === 0 && activeUserId) {

        try {
            const year = new Date().getFullYear();
            const startDate = `${year}-01-01`; 
            const endDate = `${year}-12-31`;
            await getUserReservations(activeUserId!, startDate, endDate);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            errorMessage.value = message;
            toast.add({ 
                severity: 'error', 
                summary: 'Error de acceso', 
                detail: errorMessage.value, 
                life: 3000 
            });
        }
    }
}


const chartData = computed(() => {
    const months = new Array(12).fill(0);
    
    userReservations.value.forEach(res => {
        const date = new Date(res.date);
        months[date.getMonth()]++;
    });

    return {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Mis Reservas',
                data: months,
                backgroundColor: '#C8E794',
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };
});

const chartOptions = {
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
        }
    },
    maintainAspectRatio: false
};

onMounted(async() => {
    await fetchUserReservations();
})

</script>

<template>
    <div class="max-w-7xl mx-auto w-full flex-1 px-6 py-8 flex flex-col gap-8">
        
        <div>
            <h1 class="text-3xl font-bold tracking-tight">
                Hola, {{ userStore.profile?.name || 'Jugador' }} 👋
            </h1>
            <p class="text-gray-500 mt-1">Gestiona tus partidos y reservas</p>
        </div>

        <section class="lg:col-span-2 flex flex-col gap-4">
            <BaseCard class="min-h-60">
                <div class="flex justify-between items-center px-2">
                    <h3 class="font-semibold flex items-center gap-2">
                        <i class="pi pi-ticket"></i>
                        Mis próximas reservas
                    </h3>
                    <router-link :to="{ name: RouteNames.USER_RESERVATIONS }" class="text-xs font-bold text-slate-400 hover:text-black">
                        VER HISTORIAL
                    </router-link>
                </div>


                <div v-if="upcomingReservations.length === 0" 
                        class="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed mt-3">
                        <i class="pi pi-calendar-times text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500">No tienes reservas activas para esta semana</p>
                    </div>
                <div v-if="upcomingReservations.length > 0" class="mt-3 flex flex-col gap-3">
                    <BookingCard 
                        v-for="res in upcomingReservations" 
                        :key="res.id" 
                        :reservation="res" 
                    />
                </div>
            </BaseCard>
        </section>


        <section>
            <BaseCard>
                <h3 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="pi pi-chart-line"></i>
                    Actividad Anual
                </h3>
                
                <div class="h-64">
                    <Chart v-if="userReservations.length > 0" type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
                </div>
            </BaseCard>
        </section>
    </div>
</template>