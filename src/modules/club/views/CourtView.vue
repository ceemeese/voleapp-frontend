<script setup lang="ts">
import type {  BaseInputProps, ActionColumn } from 'ui';
import { BaseButton, BaseCard, BaseDialog } from 'ui'
import { useCourt } from '@/composables/useCourt';
import { useClub } from '@/composables/useClub';
import { onMounted } from 'vue';
import type { Court } from '../interfaces';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Tag from 'primevue/tag';
import { useConfirm } from "primevue/useconfirm";
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { addCourtSchema, updateCourtSchema } from '../schemas/addCourt.schema';


interface CourtForm {
    name: string;
    type: string;
    basePrice: number;
    isActive: boolean;
}

const COURT_TYPE_OTIONS = [
    {id: 1, name: 'Indoor'},
    {id: 2, name: 'Outdoor'},
    {id: 3, name: 'Beach'},
];

const toast = useToast();
const confirmPopup = useConfirm();
const { activeClubId } = useClub();
const resolverAdd = zodResolver(addCourtSchema);
const resolverUpdate = zodResolver(updateCourtSchema);
const selectedCourt = ref<Court>();
const { getCourtsByClubId, activateCourt, deactivateCourt, updateCourt, registerCourt} = useCourt();
const courts = ref<Court[]>([]);
const errorMessage = ref<string>('');
const courtAddDialogRef = ref();
const courtEditDialogRef = ref();

const addInputsDialog : BaseInputProps[] = [
    { field: 'name', label: 'Nombre de pista', icon: 'pi pi-table'},
    { field: 'basePrice', label: 'Precio base', icon: 'pi pi-euro'},
    { field: 'type', label: 'Tipo de pista', icon: 'pi pi-euro', type: 'select', options: COURT_TYPE_OTIONS, optionLabel: 'name', optionValue: 'name' },
    { field: 'isActive', label: 'Está en funcionamiento?', icon: 'pi pi-phone', type: 'boolean' }
]

const editInputsDialog : BaseInputProps[] = [
    { field: 'name', label: 'Nombre de pista', icon: 'pi pi-table'},
    { field: 'basePrice', label: 'Precio base', icon: 'pi pi-euro'},
]

onMounted(async () => {
    if (activeClubId.value){
        await loadCourts();
    }
});

const courtActions : ActionColumn<Court>[] = [
    {
        isVisible: true,
        icon: 'pi pi-pencil',
        class: 'text-blue-600',
        action: (court) => handleCourtEditDialog(court)
    },
    {
        isVisible: true,
        icon: (court) => court.isActive ? 'pi pi-trash' : 'pi pi-refresh',
        class: (court) => court.isActive ? '!text-red-600' : 'text-green-600',
        action: (court, event) => handleToggleStatus(court, event)
    }
]

const getActionValue = <T>( 
    value: string | ((data: T) => string) | undefined, 
    item: T
): string => {
    if (!value) return '';
    return typeof value === 'function' ? value(item) : value;
};

const isActionVisible = <T>(
    visible: boolean | ((row: T) => boolean), 
    item: T
): boolean => {
    return typeof visible === 'function' ? visible(item) : visible;
};

const handleCourtEditDialog = (court: Court) => {
    selectedCourt.value = {...court};
    courtEditDialogRef.value.open(selectedCourt.value);
}

const onOpenCreateDialog = () => {
    courtAddDialogRef.value.open();
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


const handleToggleStatus = (court: Court, event: PointerEvent) => {

    const isActivating = !court.isActive;
    const actionText = isActivating ? 'activar' : 'desactivar';
    const severity = isActivating ? 'success' : 'danger'

    const target = event.currentTarget as HTMLElement;
    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres ${actionText} la pista seleccionado del club?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        } ,
        acceptProps: {
            label: isActivating ? 'Activar' : 'Desactivar',
            severity: severity,
        },
        accept: async () => {
            try {
                if (isActivating) {
                    await activateCourt(court.id)
                } else {
                    await deactivateCourt(court.id)
                }
                
                court.isActive = isActivating;

                toast.add({ 
                    severity: 'info', 
                    summary: 'Confirmado', 
                    detail: `Pista ${isActivating ? 'reactivada' : 'desactivada'} con éxito`, 
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
};

const onSaveAddedCourt = async (data: CourtForm) => {
    try {
        const newCourt = await registerCourt(activeClubId.value!, {   
            name: data.name, 
            type: data.type,
            basePrice: data.basePrice,
            isActive: data.isActive
        });

        courts.value.unshift(newCourt);

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


const onSaveModifiedCourt = async (updatedData: CourtForm) => {
    const courtId = selectedCourt.value?.id;
    
    try {
        const updatedCourt = await updateCourt(courtId!, {
            name: updatedData.name,
            basePrice: updatedData.basePrice
        });

        const oldCourtIndex = courts.value.findIndex(c => c.id === courtId);
        if (oldCourtIndex !== -1){
            courts.value[oldCourtIndex] = updatedCourt;
        }
        
        toast.add({ 
            severity: 'info', 
            summary: 'Confirmado', 
            detail: 'Pista modificada', 
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
}


</script>

<template>
    <div class="flex flex-col overflow-hidden h-full w-full">
        <section class="flex items-center gap-2 pl-4 pr-4">

            <BaseButton 
            icon="pi pi-plus"
            label="Añadir pista"
            class="!bg-black !border-none"
            size="small"
            rounded
            @click="onOpenCreateDialog"
            />
        </section>

        <div class="flex-1 overflow-y-auto p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <BaseCard 
                    v-for="court in courts" 
                    :key="court.id"
                    class="hover:shadow-md transition-shadow cursor-pointer"
                >
                    <template #default>
                        <div class="flex flex-col gap-4">
                            <div class="flex justify-between items-start">
                                <Tag 
                                    :severity="court.isActive ? 'success' : 'danger'" 
                                    :value="court.isActive ? 'Activa' : 'Mantenimiento'"
                                    class="text-xs"
                                />
                            </div>
                        </div>

                        <div class="py-2 mt-2">
                            <div>
                                <h3 class="font-extrabold text-xl text-slate-900 leading-tight">{{ court.name }}</h3>
                                <p class="text-sm font-medium text-slate-500">{{ court.type?.name || 'Indoor' }}</p>
                            </div>

                            <div class="flex items-center gap-1.5 mt-1">
                                <div class="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-2">
                                    <span class="text-xs font-bold uppercase">Precio Base</span>
                                    <span class="text-sm font-black"> {{ court.basePrice }}€</span> 
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-1 pt-4 mt-auto border-tborder-slate-100">
                            <BaseButton 
                                v-for="(btn, index) in courtActions"
                                v-show="isActionVisible(btn.isVisible, court)"
                                :key="index"
                                :icon="getActionValue(btn.icon, court)" 
                                text 
                                rounded 
                                size="small" 
                                @click="btn.action?.(court, $event)" 
                                :class="[getActionValue(btn.class, court), 'hover:bg-blue-50 w-10 h-10']"
                            />
                        </div>
                    </template>
                </BaseCard>

                <BaseDialog
                    ref="courtAddDialogRef"
                    header="Añadir pista"
                    subtitle="Rellene los campos solicitados"
                    :resolver="resolverAdd"
                    :inputs-dialog="addInputsDialog"
                    :model-value="selectedCourt"
                    @save="onSaveAddedCourt"
                />

                <BaseDialog
                    ref="courtEditDialogRef"
                    header="Añadir pista"
                    subtitle="Rellene los campos solicitados"
                    :resolver="resolverUpdate"
                    :inputs-dialog="editInputsDialog"
                    :model-value="selectedCourt"
                    @save="onSaveModifiedCourt"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>