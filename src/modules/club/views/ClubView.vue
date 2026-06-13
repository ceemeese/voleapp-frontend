<script setup lang="ts">
import type { InfoFieldProps, ActionColumn } from 'ui';
import { clubInputsDialog, clubSchema, type ClubUpdateFormData } from '../schemas/club.schema';
import type { Schedule } from '../interfaces';
import { scheduleInputsEditDialog, scheduleSchema, type ScheduleUpdateFormData } from '../schemas/schedule.schema';

const confirmPopup = useConfirm();
const clubStore = useClubStore();
const { schedules } = useSchedule();
const toast = useToast();
const { isLoading } = useGlobalLoading();
const clubDialogRef = ref();
const sheduleDialogRef = ref();
const resolverClub = zodResolver(clubSchema);
const resolverSchedule = zodResolver(scheduleSchema);
const selectedSchedule = ref<Schedule | undefined>();
const selectedDayId = ref<number | undefined>();

const { activeClubId, currentClubInfo, getAdminContext, updateClub } = useClub();
const { getSchedule, updateSchedule, registerSchedule, toggleSchedule } = useSchedule();

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

    if (schedules.value.length === 0) {
        await getSchedule(activeClubId.value!);
    }
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
    if (!dateRaw) return 'Cargando fecha...';

    return formatFullDate(dateRaw);
});

//aplanar objeto para poder mostrar dirección
const handleClubEditDialog = () => {
    if (!currentClubInfo.value) return;
    const clubDataForm : ClubUpdateFormData = {
        name: currentClubInfo.value?.name, 
        cif: currentClubInfo.value?.cif,
        street: currentClubInfo.value?.address.street,
        city: currentClubInfo.value?.address.city,
        zipCode: currentClubInfo.value?.address.zipCode,
        country: currentClubInfo.value?.address.country,
        phoneNumber: currentClubInfo.value?.phoneNumber,
        email: currentClubInfo.value?.email,
    }
    clubDialogRef.value.open(clubDataForm);
}

const handleScheduleEditDialog = (schedule : Schedule) => {
    selectedSchedule.value = schedule;

    const scheduleFormData : ScheduleUpdateFormData = {
        openingTime: schedule.openingTime,
        closingTime: schedule.closingTime
    }
    sheduleDialogRef.value.open(scheduleFormData);
}

const onSaveModifiedClub = async (data: ClubUpdateFormData) => {
    try {
        if (currentClubInfo.value?.id) {
            await updateClub(currentClubInfo.value?.id, {
                name: data.name, 
                cif: data.cif,
                street: data.street,
                city: data.city,
                zipCode: data.zipCode,
                country: data.country,
                phoneNumber: data.phoneNumber,
                email: data.email,
            });

            clubStore.currentClubData = {
                id: currentClubInfo.value.id,
                name: data.name,
                cif: data.cif,
                email: data.email,
                phoneNumber: data.phoneNumber,
                isActive: currentClubInfo.value.isActive,
                createdAt: currentClubInfo.value.createdAt,
                address: {
                    street: data.street,
                    city: data.city,
                    zipCode: data.zipCode,
                    country: data.country
                }
            };

            toast.add({ severity: 'success', summary: 'Confirmado', detail: 'Club modificado', life: 2000});
        }
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    }
}


const onSaveModifiedSchedule = async (data: ScheduleUpdateFormData) => {
    const isEditing = !!selectedSchedule.value?.id;

    try {
        if (isEditing && selectedSchedule.value) {
            await updateSchedule(activeClubId.value!, selectedSchedule.value.id, {
                openingTime: data.openingTime,
                closingTime: data.closingTime
            })

        } else {
            const dayName = selectedDayId.value !== undefined ? DAYS_EN[selectedDayId.value] : undefined;
            if (!dayName) return;

            await registerSchedule(activeClubId.value!, {
                dayOfWeek: dayName,
                openingTime: data.openingTime,
                closingTime: data.closingTime
            });

            toast.add({ severity: 'success', summary: 'Confirmado', detail: `Horario ${isEditing ? 'modificado': 'añadido'}`, life: 2000});
        }
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    }
}


const handleScheduleCreateDialog = (dayId : number) => {
    selectedSchedule.value = undefined;
    selectedDayId.value = dayId;

    const newScheduleData : ScheduleUpdateFormData = {
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

                toast.add({ 
                    severity: 'success', 
                    summary: 'Confirmado', 
                    detail: `Horario ${isOpening ? 'abierto' : 'cerrado'} con éxito`, 
                    life: 2000});

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Error inesperado';
                toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
            }
        },
    });
}


</script>


<template>
    <div class="flex flex-col overflow-hidden h-full w-full p-4 space-y-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Mi club</h2>
                <p class="text-sm text-slate-500">Gestióna información y horarios de club</p>
            </div>
        </div>

    

        <div class="mx-auto w-full max-h-full p-1 overflow-y-auto custom-scrollbar">
            <UserCardProfile 
                :main-text="currentClubInfo?.name"
                :subtext="locationSubtext"
                :initials="clubInitials"
                size="large"
                shape="circle"
                @edit="handleClubEditDialog"
                padding="p-2"
                class="!shadow-md"
            />

            <BaseCard padding="p-6" class="!shadow-md mt-3">
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
                        :value="'Desde ' + formattedDate"
                        :icon="'pi pi-calendar'"
                    />

                </div>
            </BaseCard>

            <BaseCard padding="p-6" class="!shadow-md mt-3">
                <div class="flex items-center justify-between mb-8">
                    <h3 class="text-lg font-bold text-slate-800">Horarios</h3>
                </div>

                <ScheduleManager
                    :value="schedules"
                    :day-names="DAYS_TRANSLATION"
                    :actions="scheduleActions">
                </ScheduleManager>
            </BaseCard>

            <BaseDialog
                ref="clubDialogRef"
                header="Editar club"
                subtitle="Actualiza la información de tu club"
                :resolver="resolverClub"
                :inputs-dialog="clubInputsDialog"
                @save="onSaveModifiedClub"
                :loading="isLoading"
                />

                
            <BaseDialog
                ref="sheduleDialogRef"
                header="Configurar Horarios"
                subtitle="Gestiona los turnos de apertura y cierre de cada día"
                :resolver="resolverSchedule"
                :inputs-dialog="scheduleInputsEditDialog"
                @save="onSaveModifiedSchedule"
                :loading="isLoading"
            />

        </div>
    </div>

</template>