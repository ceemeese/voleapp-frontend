<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { BaseCard, BaseInfoField, UserCardProfile, ScheduleManager } from 'ui';
import type { InfoFieldProps, BaseInputProps, ActionColumn } from 'ui';
import { useClub } from '@/composables/useClub';
import { COUNTRY_FLAGS_DATA, getCountryFlag, getCountryName } from '@/utils/country-utils';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateClubSchema } from '../schemas/updateClub.schema';
import type { Club, Schedule } from '../interfaces';
import { useClubStore } from '@/stores/clubStore';
import { useSchedule } from '@/composables/useSchedule';
import { DAYS_EN, DAYS_TRANSLATION } from '@/utils/day-utils';
import { useConfirm } from "primevue/useconfirm";


const confirmPopup = useConfirm();
const clubStore = useClubStore();
const toast = useToast();
const errorMessage = ref<string>('');
const clubDialogRef = ref();
const sheduleDialogRef = ref();
const resolver = zodResolver(updateClubSchema);
const { activeClubId, currentClubInfo, getAdminContext, updateClub } = useClub();
const { getSchedule, updateSchedule, registerSchedule, toggleSchedule } = useSchedule();
const clubSchedules = ref<Schedule[]>([]);


const inputsEditScheduleDialog : BaseInputProps[] = [
    { field: 'openingTime', label: 'Apertura', type: 'time', icon: 'pi pi-clock' },
    { field: 'closingTime', label: 'Cierre', type: 'time', icon: 'pi pi-clock' },
]

const inputsClubDialog : BaseInputProps[] = [
    { field: 'name', label: 'Nombre', icon: 'pi pi-user' },
    { field: 'cif', label: 'CIF', icon: 'pi pi-id-card' },
    { field: 'street', label: 'Calle', icon: 'pi-address-book' },
    { field: 'city', label: 'Ciudad', icon: 'pi-address-book' },
    { field: 'zipCode', label: 'Código postal', icon: 'pi pi-address-book' },
    { field: 'country', label: 'País', type: 'select', options: Object.entries(COUNTRY_FLAGS_DATA).map(([code, data]) => ({
        code,
        label: `${data.flag} ${data.name}`
    })), optionLabel: 'label' , optionValue: 'code'},
    { field: 'phoneNumber', label: 'Teléfono', icon: 'pi pi-phone' },
    { field: 'email', label: 'Email', icon: 'pi pi-envelope', type: 'email' }
]

const profileClubField = computed<InfoFieldProps[]>(() => [
    { label: 'Nombre', value: currentClubInfo.value?.name, icon: 'pi pi-id-card'},
    { label: 'Dirección', value: currentClubInfo.value?.address
    ? `${currentClubInfo.value.address.street}, ${currentClubInfo.value.address.zipCode} ${currentClubInfo.value.address.city}`
    : '', icon: 'pi pi-home'},
    { label: 'CIF', value: currentClubInfo.value?.cif, icon: 'pi pi-id-card'},
    { label: 'Email', value: currentClubInfo.value?.email, icon: 'pi pi-envelope'},
    { label: 'Teléfono', value: currentClubInfo.value?.phoneNumber, icon: 'pi pi-phone'}
])

const scheduleActions = {
    day: [
        {
            isVisible: true,
            icon: 'pi pi-plus',
            action: (dayData) => {
                const dayId = Number(dayData.dayOfWeek?.id || dayData.id);
                handleScheduleCreateDialog(dayId);
            }
        }
    ] as ActionColumn<Schedule>[],
    slot: [
        {
            isVisible: (slot: Schedule) => !slot.isClosed,
            icon: 'pi pi-pencil',
            action: (slot) => handleScheduleEditDialog(slot)
        },
        {
            isVisible: true,
            icon: (slot: Schedule) => slot.isClosed ? 'pi pi-lock' : 'pi pi-lock-open',
            class: (slot: Schedule) => slot.isClosed ? '!text-red-400 hover:!text-red-600' : 'text-green-400 hover:!text-green-600',
            action: (slot, event) => handleToggleSchedule(slot, event)
        }
    ] as ActionColumn<Schedule>[]
}


onMounted(async () => {
    if (!activeClubId.value) {
        await getAdminContext();
    }

    clubSchedules.value = await getSchedule(activeClubId.value!);
    console.log('SCHEDULESSSS', clubSchedules.value);
});


const clubInitials = computed(() => {
    return currentClubInfo.value?.name.charAt(0).toUpperCase() || 'U';
})

const locationSubtext = computed(() => {
    if(!currentClubInfo.value?.address) return 'Cargando información...';

    const { city, country } = currentClubInfo.value?.address;
    const countryName = getCountryName(country);
    const countryFlag = getCountryFlag(country);

    return `${city}, ${countryName} ${countryFlag}`;
});


const formattedDate = computed(() => {
    const dateRaw = currentClubInfo.value?.createdAt; 
    
    return new Date(dateRaw!).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    });
   
});

//aplanar objeto para poder mostrar dirección
const handleClubEditDialog = () => {
    const clubDataForm = {
        ...currentClubInfo.value,
        street: currentClubInfo.value?.address.street,
        city: currentClubInfo.value?.address.city,
        zipCode: currentClubInfo.value?.address.zipCode,
        country: currentClubInfo.value?.address.country,
    }
    clubDialogRef.value.open(clubDataForm);
}

const handleScheduleEditDialog = (schedule : Schedule) => {
    console.log(schedule, 'LO QUE SE MANDAAAA')
    sheduleDialogRef.value.open(schedule);
}

const onSaveModifiedClub = async (updatedData: Club) => {
    try {
        await updateClub(updatedData.id, {
            name: updatedData.name,
            cif: updatedData.cif,
            street: updatedData.address.street,
            city: updatedData.address.city,
            zipCode: updatedData.address.zipCode,
            country: updatedData.address.country,
            email: updatedData.email,
            phoneNumber: updatedData.phoneNumber
        });

        clubStore.currentClubData = {... clubStore.currentClubData, ...updatedData}

        toast.add({ 
            severity: 'info', 
            summary: 'Confirmado', 
            detail: 'Club modificado', 
            life: 3000
        });
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


const onSaveModifiedSchedule = async (updatedData: Schedule) => {
    try {
        if (updatedData.id) {
            await updateSchedule(activeClubId.value!, updatedData!.id, {
                openingTime: updatedData.openingTime,
                closingTime: updatedData.closingTime
            })

            clubSchedules.value = clubSchedules.value.map(schedule => 
                schedule.id === updatedData.id
                ? {... schedule, ...updatedData}
                : schedule
            );

            toast.add({ 
                severity: 'info', 
                summary: 'Confirmado', 
                detail: 'Club modificado', 
                life: 3000
            });
        } else {
            const newSlot = await registerSchedule(activeClubId.value!, {
                dayOfWeek: updatedData.dayOfWeek.name,
                openingTime: updatedData.openingTime,
                closingTime: updatedData.closingTime
            });

            clubSchedules.value = [...clubSchedules.value, {...newSlot}];

            toast.add({ 
                severity: 'info', 
                summary: 'Confirmado', 
                detail: 'Horario añadido', 
                life: 3000
            });
        }
        
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


const handleScheduleCreateDialog = (dayId : number) => {
    const newScheduleData = {
        dayOfWeek: {
            id: dayId,
            name: DAYS_EN[dayId]
        },
        openingTime: "09:00",
        closingTime: "14:00",
    }

    sheduleDialogRef.value.open(newScheduleData);
};

const handleToggleSchedule = (schedule: Schedule, event: PointerEvent) => {
    const isOpening = schedule.isClosed;
    const actionText = isOpening ? 'abrir' : 'cerrar';
    const severity = isOpening ? 'success' : 'danger'
    const target = event.currentTarget as HTMLElement;

    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres ${actionText} esta franja horaria?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        } ,
        acceptProps: {
            label: isOpening ? 'Abrir' : 'Cerrar',
            severity: severity,
        },
        accept: async () => {
            try {

                await toggleSchedule(activeClubId.value!, schedule.id);

                clubSchedules.value = clubSchedules.value.map(s =>
                    s.id === schedule.id
                        ? {...s, isClosed: !s.isClosed}
                        : s
                )

                toast.add({ 
                    severity: 'info', 
                    summary: 'Confirmado', 
                    detail: `Horario ${isOpening ? 'abierto' : 'cerrado'} con éxito`, 
                    life: 3000});

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
        },
    });
}


</script>


<template>
    <div class="mx-auto w-full h-full max-w-7xl p-4 overflow-y-auto custom-scrollbar">
        <UserCardProfile 
        :main-text="currentClubInfo?.name"
        :subtext="locationSubtext"
        :initials="clubInitials"
        size="xlarge"
        shape="circle"
        @edit="handleClubEditDialog"
        padding="p-2"
        >
    
        </UserCardProfile>

        <BaseCard class="p-6 mt-3">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-bold text-slate-800">Información Personal</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                
                <BaseInfoField
                    v-for="field in profileClubField"
                    :key="field.label"
                    :label="field.label"
                    :value="field.value"
                    :icon="field.icon"
                />

                <BaseInfoField
                    :label="'Miembro de la comunidad'"
                    :value="'Usuario desde ' + formattedDate"
                    :icon="'pi pi-calendar'"
                />

            </div>
        </BaseCard>

        <BaseCard class="p-6 mt-3">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-bold text-slate-800">Horarios</h3>
            </div>

            <ScheduleManager
                :value="clubSchedules"
                :day-names="DAYS_TRANSLATION"
                :actions="scheduleActions">
            </ScheduleManager>
        </BaseCard>

        <BaseDialog
            ref="clubDialogRef"
            header="Editar club"
            subtitle="Actualiza la información de tu club"
            :resolver="resolver"
            :inputs-dialog="inputsClubDialog"
            @save="onSaveModifiedClub"
            />

            
        <BaseDialog
            ref="sheduleDialogRef"
            header="Configurar Horarios"
            subtitle="Gestiona los turnos de apertura y cierre de cada día"
            :inputs-dialog="inputsEditScheduleDialog"
            @save="onSaveModifiedSchedule"
        >

        </BaseDialog>

    </div>

</template>