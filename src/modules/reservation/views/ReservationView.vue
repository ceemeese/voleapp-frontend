<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { AddReservation, ReservationDataDialog } from '../interfaces';
import type { CourtGroupedResponse, CourtAvailabilityDetail } from '@/modules/club/interfaces';
import { isHandledError, getErrorMessage } from '@/api/errorsApi';

const toast = useToast();
const router = useRouter();
const { profile } = useUserStore();
const { registerReservation, refreshCurrentUserReservations } = useReservation();
const { searchAvailability } = useCourt();
const selectedDate = ref<Date>();
const duration = ref<number | undefined>(undefined);
const cityFilter = ref<string>('');
const reservationDialogRef = ref();
const errorMessage = ref<string>('');
const reservationData = ref<ReservationDataDialog>();
const availablesCourts = ref<CourtGroupedResponse[]>([]);

const formattedDate = computed(() => {
    if (!selectedDate.value) return '';
    return selectedDate.value.toLocaleDateString('sv-SE'); 
});

const formattedStartTime = computed(() => {
    if (!selectedDate.value) return '';
    return selectedDate.value.toTimeString().split(' ')[0]?.slice(0,5);
})


const fetchAvailabilityCourts = async () => {
    try {
        if (!selectedDate.value || !duration.value) return;
        availablesCourts.value = await searchAvailability(cityFilter.value, selectedDate.value, duration.value)
        
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        errorMessage.value = message;
        toast.add({
            severity: 'error',
            summary: 'Error de acceso',
            detail: errorMessage.value,
            life: 2000
        });
    }
}


const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    if (hours === undefined || minutes === undefined) return '00:00';

    const date = new Date();
    date.setHours(hours!, minutes! + durationMinutes);
    return date.toTimeString().split(' ')[0]?.slice(0, 5);
};

const handleReserve = (court: CourtAvailabilityDetail, club: CourtGroupedResponse) => {
    if (!selectedDate.value || !duration.value) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona día, hora y duración', life: 2000 });
        return;
    }

    const startTime = formattedStartTime.value
    const endTime = calculateEndTime(startTime!, duration.value!);

    const summaryReservation : ReservationDataDialog = {
        courtId: court.id,
        courtName: court.name,
        userId: profile?.id,
        userName: `${profile?.name} ${profile?.lastName}`,
        type: court.type.name,
        clubName: club!.clubName,
        clubAddress: club!.address,
        date: formattedDate.value,
        startTime: startTime!,
        endTime: endTime!,
        duration: duration.value,
        price: court.price,
    }
    reservationData.value = summaryReservation;

    reservationDialogRef.value.open(summaryReservation);
};


const handleConfirmReservation = async () => {

    if (!reservationData.value) return;
     try {
        const formData : AddReservation = {
            courtId: reservationData.value.courtId!,
            date: reservationData.value.date,
            startTime: reservationData.value.startTime,
            endTime: reservationData.value.endTime,
        }
        await registerReservation(formData);
            
        await refreshCurrentUserReservations();

        toast.add({ 
            severity: 'success', 
            summary: 'Confirmado', 
            detail: 'Reserva registrada', 
            life: 2000});


        await new Promise(resolve => setTimeout(resolve, 2000))

        router.push({ name: RouteNames.USER_HOME });
        
    } catch (error: unknown) {
        if (isHandledError(error)) return;
        const message = getErrorMessage(error);
        errorMessage.value = message;
        toast.add({
            severity: 'error',
            summary: 'Error de acceso',
            detail: errorMessage.value,
            life: 2000
        });
    }
}

watch([selectedDate, duration, cityFilter], () => {
    if (selectedDate.value && duration.value && cityFilter.value.length >= 3) {
        fetchAvailabilityCourts();
    }
});

</script>

<template>
    <div class="min-h-screen bg-slate-50 max-w-7xl w-full flex-1 px-4 sm:px-6 py-8 flex flex-col">
    
        <section class="relative h-64 md:h-80 bg-slate-900 overflow-hidden -mb-12 rounded-2xl">
            <img 
                src="/src/assets/authimage2.jpg" 
                class="absolute inset-0 w-full h-full object-cover" 
                alt="Pista de pádel"
            >
            <div class="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6">
                <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight">
                    RESERVA TU <span class="text-[#C8E794]">PISTA</span>
                </h1>
                <p class="text-slate-300 mt-2 max-w-md font-medium">
                    Compara horarios y precios en los mejores clubes de la zona
                </p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-6 relative z-20">
            <BaseDateSelector v-model="selectedDate" show-time>
                <template #additional-filters>
                    <FilterSelectorReservation
                    v-model:city="cityFilter"
                    v-model:duration="duration"/>
                </template>
            </BaseDateSelector>
        </div>

        <transition name="fade-slide" mode="out-in">
            <div v-if="availablesCourts.length > 0" :key="availablesCourts.length > 0 ? 'results' : 'empty'">
                    <GroupedList 
                        v-if="duration && availablesCourts.length > 0"
                        :groups="availablesCourts" 
                        groupTitleKey="clubName" 
                        groupSubtitleKey="address"
                        itemKey="availableCourts"
                        groupIconKey="weatherIcon"
                    >
                    
                        <template #card="{ item, group }">
                            <AppItemCard 
                            :court="item"
                            :duration="duration"
                            @reserve="handleReserve(item, group)" 
                            />
                        </template>

                        <template #header-action="{ count }">
                            <span class="px-3 py-1 sm:px-4 sm:py-2 bg-[#C8E794] text-[#344533] text-[10px] sm:text-xs font-black rounded-full uppercase whitespace-nowrap">
                            {{ count }}     
                            <span class="hidden sm:inline">Disponibles</span><span class="sm:hidden">Disp.</span></span>
                        </template>
                </GroupedList>
            </div>

            <div v-else class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <i class="pi pi-calendar-times text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500 font-medium">No se han encontrado reservas en este periodo.</p>
            </div>
        </transition>
        
        <BaseDialog
            ref="reservationDialogRef"
            header="Resumen de la reserva"
            subtitle="Revisa los detalles antes de confirmar"
            @save="handleConfirmReservation"
        >
            <template #default="{ data }">
                <ReservationSummary :reservation="data as ReservationDataDialog"/>
            </template>
        </BaseDialog>
    </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>