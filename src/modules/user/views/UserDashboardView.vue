<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';
import type { UserClub } from '@/modules/club/interfaces';
import type { ColumnConfig } from 'ui';
import ClubMemberCard from '@/components/ClubMemberCard.vue';

const userStore = useUserStore();
const { getUserReservations, userReservations } = useReservation();
const { getClubsByMemberId, toggleFavourite } = useMember();
const authStore = useAuthStore();
const activeUserId = authStore.userId;
const toast = useToast();
const userMemberClubs = ref<UserClub[]>([])


const rankingColumns: ColumnConfig<{ position: number; clubName: string; count: number }>[] = [
    { field: 'position', header: 'Pos', sortable: false },
    { field: 'clubName', header: 'Club', sortable: false },
    { field: 'count', header: 'Reservas', sortable: false },
];

const currentYear = new Date().getFullYear();
const currentYearReservations = computed(() =>
    userReservations.value.filter(res => new Date(res.date).getFullYear() === currentYear)
);

const upcomingReservations = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return currentYearReservations.value
        .filter(res => new Date(res.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const fetchUserClubsMember = async() => {
    if (!activeUserId) return;
    try {
        userMemberClubs.value = await getClubsByMemberId(activeUserId);
    } catch (error: unknown){
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
    }
}

const onToggleFavourite = async(clubId: string) => {
    if (!activeUserId) return;
    try {
        await toggleFavourite(clubId, activeUserId);
        const club = userMemberClubs.value.find(c => c.clubId === clubId);
        if (club) {
            club.isFavourite = !club.isFavourite;
        }
    } catch (error: unknown){
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
    }
}


const fetchUserReservations = async() => {
    if (userReservations.value.length === 0 && activeUserId) {

        try {
            const year = new Date().getFullYear();
            const startDate = `${year}-01-01`; 
            const endDate = `${year}-12-31`;
            await getUserReservations(activeUserId!, startDate, endDate);
        } catch (error: unknown) {
            if (isHandledError(error)) return;
            const message = getErrorMessage(error);
            toast.add({
                severity: 'error', 
                summary: 'Error de acceso', 
                detail: message, 
                life: 2000 
            });
        }
    }
}


const chartData = computed(() => {
    const months = new Array(12).fill(0);
    
    currentYearReservations.value.forEach(res => {
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


const sortedClubs = computed(() =>
    [...userMemberClubs.value].sort((a, b) => Number(b.isFavourite) - Number(a.isFavourite))
);

const clubRanking = computed(() => {
    
    const counts = currentYearReservations.value.reduce((acc, res) => {
        if (!acc[res.clubId]) acc[res.clubId] = { clubName: res.clubName, count: 0 };
        acc[res.clubId]!.count++;
        return acc;
    }, {} as Record<string, { clubName: string; count: number }>);

    return Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .map((item, i) => ({ ...item, position: i + 1 }));
});

onMounted(async() => {
    await fetchUserReservations();
    await fetchUserClubsMember();
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

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <BaseCard>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-2">
                    <h3 class="font-semibold flex items-center gap-2">
                        <i class="pi pi-ticket"></i>
                        Mis próximas reservas
                    </h3>
                    <router-link :to="{ name: RouteNames.USER_RESERVATIONS }" class="text-xs font-bold text-slate-400 hover:text-black uppercase">
                        Ver historial
                    </router-link>
                </div>

                <div v-if="upcomingReservations.length === 0"
                    class="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed mt-3">
                    <i class="pi pi-calendar-times text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500">No tienes reservas activas para esta semana</p>
                </div>
                
                <div v-if="upcomingReservations.length > 0" class="mt-3 flex flex-col gap-3 max-h-90 overflow-y-auto pr-1">
                    <BookingCard
                        v-for="res in upcomingReservations"
                        :key="res.id"
                        :reservation="res"
                    />
                </div>
                
            </BaseCard>

            <BaseCard>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-2">
                    <h3 class="font-semibold flex items-center gap-2">
                        <i class="pi pi-shop"></i>
                        Mis clubs
                    </h3>
                </div>

                <div v-if="userMemberClubs.length === 0"
                        class="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed mt-3">
                        <i class="pi pi-calendar-times text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500">Todavía no has jugado en ningún club</p>
                    </div>
                
                <div v-if="userMemberClubs.length > 0" class="mt-3 flex flex-col gap-3 max-h-90 overflow-y-auto pr-1">
                    <ClubMemberCard
                        v-for="userClub in sortedClubs"
                        :key="userClub.clubId"
                        :club="userClub"
                        @toggle-favourite="onToggleFavourite"
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

        <BaseCard>
            <h3 class="font-semibold flex items-center gap-2 mb-4">
                <i class="pi pi-trophy"></i>
                Clubs donde más has jugado este {{ currentYear }}
            </h3>

            <div v-if="clubRanking.length === 0" class="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed">
                <i class="pi pi-chart-bar text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Aún no tienes reservas este año</p>
            </div>

            <BaseDataTable
                v-else
                :value="clubRanking"
                :columns="rankingColumns"
                :show-search="false"
                :paginator="false"
            >
                <template #position="{ data }">
                    <div class="flex justify-center w-10">
                        <span v-if="data.position === 1" class="text-lg">🥇</span>
                        <span v-else-if="data.position === 2" class="text-lg">🥈</span>
                        <span v-else-if="data.position === 3" class="text-lg">🥉</span>
                        <span v-else class="text-slate-400 font-medium text-sm">{{ data.position }}</span>
                    </div>
                </template>

                <template #clubName="{ data }">
                    <span class="font-semibold text-slate-700">{{ data.clubName }}</span>
                </template>

                <template #count="{ data }">
                     <BasePill
                        type="success"
                        :text="`${data.count}`"
                        icon="pi pi-calendar"
                    />
                </template>
            </BaseDataTable>
        </BaseCard>
    </div>
</template>