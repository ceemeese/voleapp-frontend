<script setup lang="ts">
import { BaseCard, EventCalendar, type BaseInputProps } from 'ui';
import { useClub } from '@/composables/useClub';
import { useEvent } from '@/composables/useEvent';
import { computed, onMounted, ref } from 'vue';
import type { Court, Event } from '../interfaces';
import { useToast } from 'primevue/usetoast';
import { useCourt } from '@/composables/useCourt';
import type { CalendarEvent, CalendarResource } from 'node_modules/ui/dist/components/organisms/eventCalendar/EventCalendar.vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { addEventSchema } from '../schemas/event.schema';
import { BaseDatePicker } from 'ui';
import { useSchedule } from '@/composables/useSchedule';
import type { Reservation } from '@/modules/reservation/interfaces';
import { useReservation } from '@/composables/useReservation';
import { parseTimeOnlyToDate } from '@/helpers/dateHelpers';

const toast = useToast();
const { getEventsRangeByClub, updateEvent, createEvent } = useEvent();
const { activeClubId } = useClub();
const { getClubReservations } = useReservation();
const { getCourtsByClubId } = useCourt();
const { schedules, getSchedule } = useSchedule();
const resolver = zodResolver(addEventSchema);
const selectedEvent = ref<Event>();
const selectedDate = ref(new Date());
    
const eventDialogRef = ref();
const events = ref<Event[]>([]);
const reservations = ref<Reservation[]>([]);
const courts = ref<Court[]>([]);

interface EventForm {
    courtId: string;
    date: Date,
    startTime: string,
    endTime: string,
    eventName: string;
    description: string;
}


const formData  = ref<EventForm>({
    courtId: '',
    date: new Date(),
    startTime: '00:00',
    endTime: '00:00',
    eventName: '',
    description: '',
})

const inputsCreateEventDialog = computed((): BaseInputProps[] => [
    { 
        field: 'courtId', 
        label: 'Pista', 
        icon: 'pi pi-table', 
        type: 'select', 
        placeholder: 'Selecciona pista',
        options: courts.value.filter(c => c.isActive || c.id === formData.value.courtId).map(c => ({ id: c.id, nameCourt: c.name })), 
        optionLabel: 'nameCourt', 
        optionValue: 'id',
        disabled: !!selectedEvent.value?.id
    },
    { field: 'date', label: 'Fecha', type: 'date' },
    { field: 'startTime', label: 'Inicio', icon: 'pi pi-clock', type: 'time', stepMinute: 15 },
    { field: 'endTime', label: 'Fin', icon: 'pi pi-clock', type: 'time', stepMinute: 15 },
    { field: 'eventName', label: 'Nombre del evento', icon: 'pi pi-calendar' },
    { field: 'description', label: 'Notas', icon: 'pi pi-comment' },
]); 


const calendarResources = computed(() :CalendarResource[] => {
    return courts.value.map(court => ({
        id: court.id,
        label: court.name,
        isDisabled: !court.isActive,
        data: court,
    }));
});

const calendarEvents  = computed(() : CalendarEvent[] => {
    const mappedEvents = events.value.map(event => ({
        id: event.id,
        start: event.startTime,
        end: event.endTime,
        title: event.eventName,
        content: event.description,
        resourceId: event.courtId,
        colorClass: 'bg-[#EEF7FC] border-[#94C8E7] text-[#3A7FA6]',
        data: event,
    }));

    const mappedReservations = reservations.value.map(reservation => ({
        id: reservation.id,
        start: parseTimeOnlyToDate(reservation.startTime, selectedDate.value),
        end: parseTimeOnlyToDate(reservation.endTime, selectedDate.value),
        title: 'Reserva',
        content: reservation.notes || `Pista reservada por usuario ${reservation.userId}`,
        resourceId: reservation.courtId,
        colorClass:'bg-[#F3FAEA] border-[#C8E794] text-[#6B8F3A]',
        data: reservation,
    }))

    return [...mappedEvents, ...mappedReservations];
});


const selectedDaySchedule = computed(() => {
    const dayIndex = selectedDate.value.getDay() === 0 ? 7 : selectedDate.value.getDay();
    return schedules.value
        .filter(s => s.dayOfWeek.id === dayIndex && !s.isClosed)
        .sort((a, b) => a.openingTime.localeCompare(b.openingTime));
});

const minOpeningTime = computed(() => {
    if (selectedDaySchedule.value.length === 0) return 0;
    return parseInt(selectedDaySchedule.value[0]!.openingTime.split(':')[0]!);
});

const maxClosingTime = computed(() => {
    if (selectedDaySchedule.value.length === 0) return 0;
    const last = selectedDaySchedule.value[selectedDaySchedule.value.length - 1]!;
    return parseInt(last.closingTime.split(':')[0]!);
})

const closedRanges = computed(() => {
    if (selectedDaySchedule.value.length <= 1) return [];
    
    const ranges = [];
    for (let i = 0; i < selectedDaySchedule.value.length - 1; i++) {
        const current = selectedDaySchedule.value[i]!;
        const next = selectedDaySchedule.value[i + 1]!;
        ranges.push({
            from: parseInt(current.closingTime.split(':')[0]!),
            to: parseInt(next.openingTime.split(':')[0]!)
        });
    }
    return ranges;
});

const loadDayData = async (date: Date) => {
    if (!activeClubId.value) return;

    const startDateTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const endDateTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

    const dateOnlyStr = date.toISOString().split('T')[0];

    const [eventsData, reservationsData] = await Promise.all([
        getEventsRangeByClub(activeClubId.value, startDateTime, endDateTime),
        getClubReservations(activeClubId.value, dateOnlyStr)
    ]);

    events.value = eventsData;
    reservations.value = reservationsData;
    console.log(events.value, 'EVENTOS PROMISE ALL') 
    console.log(reservations.value, 'RESERVAR PROMISE ALL') 
}


onMounted(async () => {
    if (activeClubId.value){
        await loadCourts();
    }

    if (schedules.value.length === 0) {
        await getSchedule(activeClubId.value!);
    }
    await loadDayData(selectedDate.value);
});

const onDateChange = async (date: Date) => {
    if (!date) return; 
    selectedDate.value = date;
    await loadDayData(date);
}

const onOpenCreateEventDialog = () => {
    selectedEvent.value = undefined;
    const now = new Date();

    const pad = (n: number) => String(n).padStart(2, '0');
    
    formData.value = {
        courtId: '',
        date: new Date(),
        startTime: `${pad(now.getHours())}:00`,
        endTime: `${pad(now.getHours())}:00`,
        eventName: '',
        description: '',
    };
    eventDialogRef.value.open(formData.value);
}

const onOpenEditEventDialog = (eventData : Event) => {
    selectedEvent.value = eventData;
    const start = new Date(eventData.startTime);
    const end = new Date(eventData.endTime);

    const pad = (n: number) => String(n).padStart(2, '0');

    formData.value = {
        courtId: eventData.courtId,
        date: start,
        startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`, 
        endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
        eventName: eventData.eventName,
        description: eventData.description ? eventData.description : '',
    }

    eventDialogRef.value.open(formData.value);
}

const onCellClick = ({ hour, resourceId }: { hour: number, resourceId: string | number }) => {
    selectedEvent.value = undefined;
    const pad = (n: number) => String(n).padStart(2, '0');

    formData.value = {
        courtId: String(resourceId),
        date: selectedDate.value,
        startTime: `${pad(hour)}:00`,
        endTime: `${pad(hour + 1)}:00`,
        eventName: '',
        description: '',
    };
    eventDialogRef.value.open(formData.value);
}

const loadCourts = async () => {
    try {
        const rawCourts = await getCourtsByClubId(activeClubId.value!);
        courts.value = rawCourts.map(court => ({
            ...court,
        }))
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 5000 })
    }
}

const combineDateAndTime = (baseDate: Date, timeInput: Date | string) => {
    const d = new Date(baseDate);
    if (timeInput instanceof Date) {
        d.setHours(timeInput.getHours(), timeInput.getMinutes(), 0, 0);
    } else {
        const [h, m] = timeInput.split(':').map(Number);
        d.setHours(h!, m, 0, 0);
    }
    return d;
};

const onSaveModifiedEvent = async (updatedData: EventForm) => {
    
    const eventId = selectedEvent.value?.id ? selectedEvent.value?.id : undefined;
    const actionText = eventId ? 'modificado' : 'creado';

    const selectedCourt = courts.value.find(c => c.id === updatedData.courtId);
    if (!selectedCourt?.isActive) {
        toast.add({
            severity: 'warn',
            summary: 'Pista no disponible',
            detail: 'No se pueden crear eventos en una pista cerrada',
            life: 3000
        });
        return;
    }

    try {
        const payload = {
            startTime: combineDateAndTime(updatedData.date, updatedData.startTime).toISOString(),
            endTime: combineDateAndTime(updatedData.date, updatedData.endTime).toISOString(),
            eventName: updatedData.eventName,
            description: updatedData.description,
            courtId: updatedData.courtId
        };

        if (selectedEvent.value?.id) {
            const updatedEvent = await updateEvent(updatedData.courtId, eventId!, payload);

            const oldEventIndex = events.value.findIndex(e => e.id === eventId);
            if (oldEventIndex !== -1){
                events.value[oldEventIndex] = updatedEvent;
            }

        } else {
            const createdEvent = await createEvent(updatedData.courtId, payload);
            events.value.push(createdEvent);
        }

        toast.add({ severity: 'info', summary: 'Confirmado', detail: `Evento ${actionText}`, life: 3000});
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({  severity: 'error', summary: 'Error de acceso', detail: message, life: 5000 });
    }
}

</script>

<template>
    <div class="h-screen flex flex-col overflow-hidden">
        <section class="flex items-center gap-2 pl-4 pr-4 mb-2 flex-shrink-0">
            <BaseButton 
            icon="pi pi-plus"
            label="Añadir evento"
            class="!bg-black !border-none"
            size="small"
            rounded
            @click="onOpenCreateEventDialog"
            />

            <BaseDatePicker
                :model-value="selectedDate"
                @update:model-value="onDateChange"
                updateModelType="date"
                class="!w-50"
                size="small"
            />
        
        </section>

        <BaseCard padding="p-4" class="!shadow-none !overflow-hidden">
                <EventCalendar
                    v-if="calendarResources.length > 0 && selectedDaySchedule.length > 0"
                    :events="calendarEvents"
                    :resources="calendarResources"
                    :min-time="minOpeningTime"
                    :max-time="maxClosingTime"
                    :closed-ranges="closedRanges"
                    @event-click="(e) => onOpenEditEventDialog(e.data)"
                    @cell-click="onCellClick"
                />
                <div v-else-if="calendarResources.length > 0 && selectedDaySchedule.length === 0" class="flex justify-center p-10 text-slate-400">
                    El club no tiene horario para este día
                </div>
                <div v-else class="flex justify-center p-10 text-slate-400">
                    Cargando pistas...
                </div>
        </BaseCard>


        <BaseDialog
            ref="eventDialogRef"
            :header="formData.courtId ? 'Modificar eventos' : 'Nuevo evento'"
            :subtitle="formData.courtId ? 'Actualiza los datos' : 'Rellena los campos para crear un evento'"
            :inputs-dialog="inputsCreateEventDialog"
            :resolver="resolver"
            @save="onSaveModifiedEvent"
        />
    </div>
</template>

<style scoped>

</style>