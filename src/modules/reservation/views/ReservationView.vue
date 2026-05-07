<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { GroupedList, BaseDateSelector } from 'ui';
import AppItemCard from '@/components/AppItemCard.vue';
import { useToast } from 'primevue/usetoast';
import FilterSelectorReservation from '@/components/FilterSelectorReservation.vue';
import ReservationSummary from '@/components/ReservationSummary.vue';
import { useReservation } from '@/composables/useReservation';
import type { AddReservation, ReservationDataDialog } from '../interfaces';

const toast = useToast();
const { registerReservation } = useReservation();
const selectedDate = ref<Date>();
const duration = ref<number | undefined>(undefined);
const cityFilter = ref<string>('');
const reservationDialogRef = ref();
const errorMessage = ref<string>('');
const reservationData = ref<ReservationDataDialog>();

const formattedDate = computed(() => {
    if (!selectedDate.value) return '';
    return selectedDate.value.toLocaleDateString('sv-SE'); 
});

const formattedStartTime = computed(() => {
    if (!selectedDate.value) return '';
    return selectedDate.value.toTimeString().split(' ')[0]?.slice(0,5);
})

//TODO: endpoints motor disponibilidad
const clubsWithAvailability = ref([
    {
        id: 1,
        name: 'Padel Center Victoria',
        address: 'Calle Mayor, 12',
        availableCourts: [
            { id: '08de8b48-a4a4-4cc7-800d-1284cd7485b7', name: 'Pista 1 (Cristal)', time: '17:00', price: 20, type: 'Indoor', duration: 90 },
            { id: '102', name: 'Pista 2 (Muro)', time: '18:30', price: 15, type: 'Outdoor', duration: 60 },
            { id: '103', name: 'Pista 3 (Cristal)', time: '20:00', price: 20, type: 'Indoor', duration: 90 },
            { id: '104', name: 'Pista 5 (Cristal)', time: '21:30', price: 18, type: 'Indoor', duration: 90 },
            { id: '105', name: 'Pista 6 (Cristal)', time: '21:30', price: 18, type: 'Indoor', duration: 90 },
        ]
    }
]);

interface AvailableCourt {
    id: string;
    name: string;
    price: number;
    type: string;
}

const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    if (hours === undefined || minutes === undefined) return '00:00';

    const date = new Date();
    date.setHours(hours!, minutes! + durationMinutes);
    return date.toTimeString().split(' ')[0]?.slice(0, 5);
};


const handleReserve = (court: AvailableCourt) => {
    if (!selectedDate.value || !duration.value) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona día, hora y duración', life: 3000 });
        return;
    }

    const club = clubsWithAvailability.value[0];
    const startTime = formattedStartTime.value
    const endTime = calculateEndTime(startTime!, duration.value!);

    const durationHours = duration.value / 60;
    const totalPrice = durationHours * court.price;
    

    const summaryReservation : ReservationDataDialog = {
        courtId: court.id,
        courtName: court.name,
        courtType: court.type,
        clubName: club!.name,
        clubAddress: club!.address,
        date: formattedDate.value,
        startTime: startTime!,
        endTime: endTime!,
        duration: duration.value,
        totalPrice: Number(totalPrice.toFixed(2))
    }
    reservationData.value = summaryReservation;

    reservationDialogRef.value.open(summaryReservation);
};


const handleConfirmReservation = async () => {

    if (!reservationData.value) return;
    console.log('Reserva pendiente');
     try {
        const formData : AddReservation = {
            courtId: reservationData.value.courtId!,
            date: reservationData.value.date,
            startTime: reservationData.value.startTime,
            endTime: reservationData.value.endTime,
        }
        const reservation = await registerReservation(formData);
        console.log(reservation, 'RESERVAA CREADA')
        //todo actrualizar reservas

        toast.add({ 
            severity: 'info', 
            summary: 'Confirmado', 
            detail: 'Reserva registrada', 
            life: 3000});
        
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

watch(selectedDate, async (newDate) => {
    console.log("Buscando disponibilidad para", newDate); 
    //TODO endpoint de disponibilidad al cambiar la fecha en selector
});

</script>

<template>
    <div class="min-h-screen bg-slate-50 max-w-7xl mx-auto w-full flex-1 px-6 py-8 flex flex-col">
    
        <section class="relative h-100 bg-slate-900 overflow-hidden -mb-12 rounded-2xl">
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

            <GroupedList 
                :groups="clubsWithAvailability" 
                groupTitleKey="name" 
                groupSubtitleKey="address"
                itemKey="availableCourts"
            >
            
                <template #card="{ item }">
                    <AppItemCard 
                    :court="item" 
                    @reserve="handleReserve(item)" 
                    />
                </template>

                <template #header-action="{ count }">
                    <span class="px-3 py-1 sm:px-4 sm:py-2 bg-[#C8E794] text-[#344533] text-[10px] sm:text-xs font-black rounded-full uppercase whitespace-nowrap">
                    {{ count }}     
                    <span class="hidden sm:inline">Disponibles</span><span class="sm:hidden">Disp.</span></span>
                </template>
        </GroupedList>

        <BaseDialog
            ref="reservationDialogRef"
            header="Resumen de la reserva"
            subtitle="Revisa los detalles antes de confirmar"
            @save="handleConfirmReservation"
        >
            <template #default="{ data }">
                <ReservationSummary :reservation="data"/>
            </template>
        </BaseDialog>
    </div>
</template>

<style scoped>

</style>