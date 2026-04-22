<script setup lang="ts">
import { BaseCard, EventCalendar, type BaseInputProps } from 'ui';
import { useClub } from '@/composables/useClub';
import { useEvent } from '@/composables/useEvent';
import { computed, onMounted, ref } from 'vue';
import type { Court, Event } from '../interfaces';
import { useToast } from 'primevue/usetoast';
import { useCourt } from '@/composables/useCourt';
import type { CalendarEvent, CalendarResource } from 'node_modules/ui/dist/components/organisms/eventCalendar/EventCalendar.vue';

const toast = useToast();
const { getEventsRangeByClub, updateEvent, createEvent } = useEvent();
const { activeClubId }= useClub();
const { getCourtsByClubId } = useCourt();
const selectedEvent = ref<Event>();

const eventDialogRef = ref();
const events = ref<Event[]>([]);
const courts = ref<Court[]>([]);
const errorMessage = ref<string>('');

interface EventForm {
    courtId: string;
    date: Date,
    startTime: Date,
    endTime: Date,
    eventName: string;
    description: string;
}
const formData  = ref<EventForm>({
    courtId: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
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
        options: courts.value.map(c => ({ id: c.id, nameCourt: c.name })), 
        optionLabel: 'nameCourt', 
        optionValue: 'id' 
    },
    { field: 'date', label: 'Fecha', type: 'date' },
    { field: 'startTime', label: 'Inicio', icon: 'pi pi-clock', type: 'time' },
    { field: 'endTime', label: 'Fin', icon: 'pi pi-clock', type: 'time' },
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
    return events.value.map(event => {
        console.log(event.startTime.getHours(), 'GET HOURSSS'); 
        return {
            id: event.id,
        start: event.startTime,
        end: event.endTime,
        title: event.eventName,
        content: event.description,
        resourceId: event.courtId,
        data: event,
        }
        
    })
})

onMounted(async () => {
    if (activeClubId.value){
        await loadCourts();
        console.log(courts.value, 'PISTAS EN VISTA DE EVENTOS')
    }

    const start = new Date();
    start.setHours(0,0,0,0);
    console.log(start)

    const end = new Date()
    end.setHours(23,59,59,999);
    console.log(end)

    events.value = await getEventsRangeByClub(activeClubId.value!, start, end)
    console.log('EVENTOSSSSS', events.value);
});

const onOpenCreateEventDialog = () => {
    selectedEvent.value = undefined;
    const now = new Date();
    now.setMinutes(0,0,0);
    
    formData.value = {
        courtId: '',
        date: new Date(),
        startTime: now,
        endTime: now,
        eventName: '',
        description: '',
    };
    eventDialogRef.value.open(formData.value);
}

const onOpenEditEventDialog = (eventData : Event) => {
    selectedEvent.value = eventData;
    const start = new Date(eventData.startTime);
    const end = new Date(eventData.endTime);

    formData.value = {
        courtId: eventData.courtId,
        date: start,
        startTime: start,
        endTime: end,
        eventName: eventData.eventName,
        description: eventData.description ? eventData.description : '',
    }

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
        errorMessage.value = message;
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage.value,
            life: 5000
        })
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

    try {
        console.log(updatedData.startTime, 'FECHA START ANTES DE PAYLOAD')
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
            console.log(updatedEvent, 'EVENTO QUE DEVUELVE DB MODIFICADO')

        } else {
            console.log(updatedData.courtId)
            const createdEvent = await createEvent(updatedData.courtId, payload);
            events.value.push(createdEvent);
        }

        toast.add({ severity: 'info', summary: 'Confirmado', detail: `Evento ${actionText}`, life: 3000});
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        errorMessage.value = message;
        toast.add({ 
            severity: 'error', 
            summary: 'Error de acceso', 
            detail: errorMessage.value, 
            life: 5000 
        });
    }
}

</script>

<template>
    <section class="flex items-center gap-2 pl-4 pr-4">
        <BaseButton 
        icon="pi pi-plus"
        label="Añadir evento"
        class="!bg-black !border-none mb-4"
        size="small"
        rounded
        @click="onOpenCreateEventDialog"
        />
    </section>
        
    <BaseCard padding="p-4" class="h-full overflow-hidden !shadow-none">
        <EventCalendar
            v-if="calendarResources.length > 0"
            :events="calendarEvents"
            :resources="calendarResources"
            :min-time="8"
            :max-time="23"
            @event-click="(e) => onOpenEditEventDialog(e.data)"
        />
        <div v-else class="flex justify-center p-10">
            Cargando pistas...
        </div>
    </BaseCard>

    <BaseDialog
        ref="eventDialogRef"
        :header="formData.courtId ? 'Modificar eventos' : 'Nuevo evento'"
        :subtitle="formData.courtId ? 'Actualiza los datos' : 'Rellena los campos para crear un evento'"
        :inputs-dialog="inputsCreateEventDialog"
        @save="onSaveModifiedEvent"
    />
</template>
