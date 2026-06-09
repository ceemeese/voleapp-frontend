<script setup lang="ts">
import type {  BaseInputProps, ActionColumn } from 'ui';
import { BaseButton, BaseDialog } from 'ui'
import { useCourt } from '@/composables/useCourt';
import { useClub } from '@/composables/useClub';
import { onMounted, ref } from 'vue';
import type { Court } from '../interfaces';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { addCourtSchema, updateCourtSchema } from '../schemas/addCourt.schema';
import CourtAdminCard from '@/components/CourtAdminCard.vue';

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
const { courts, getCourtsByClubId, activateCourt, deactivateCourt, updateCourt, registerCourt} = useCourt();
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
        class: (court) => court.isActive ? '!text-red-600' : '!text-green-600',
        action: (court, event) => handleToggleStatus(court, event)
    }
]

const handleCourtEditDialog = (court: Court) => {
    selectedCourt.value = {...court};
    courtEditDialogRef.value.open(selectedCourt.value);
}

const onOpenCreateDialog = () => {
    courtAddDialogRef.value.open();
}

const loadCourts = async () => {

    if (courts.value.length > 0) return;
    try {
        await getCourtsByClubId(activeClubId.value!);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({severity: 'error',summary: 'Error',detail: message,life: 3000
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

                toast.add({ severity: 'success', summary: 'Confirmado', detail: `Pista ${isActivating ? 'reactivada' : 'desactivada'} con éxito`, life: 3000});

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Error inesperado';
                toast.add({ severity: 'error', summary: 'Error de acceso', detail: message,life: 3000 });
            }
        },
    });
};

const onSaveAddedCourt = async (data: CourtForm) => {
    try {
        await registerCourt(activeClubId.value!, {   
            name: data.name, 
            type: data.type,
            basePrice: data.basePrice,
            isActive: data.isActive
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 });
    }
}


const onSaveModifiedCourt = async (updatedData: CourtForm) => {
    const courtId = selectedCourt.value?.id;
    
    try {
        await updateCourt(courtId!, {
            name: updatedData.name,
            basePrice: updatedData.basePrice
        });
        
        toast.add({ 
            severity: 'success', 
            summary: 'Confirmado', 
            detail: 'Pista modificada', 
            life: 3000});
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 });
    }
}

</script>

<template>
    <div class="flex flex-col overflow-hidden h-full w-full p-6 space-y-6 overflow-y-auto">
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Gestión de pistas</h2>
                <p class="text-sm text-slate-500">Configura la disponibilidad y el estado de las pistas del club</p>
            </div>

            <div class="flex">
                <BaseButton 
                    icon="pi pi-plus"
                    label="Añadir pista"
                    class="!bg-black !border-none"
                    size="small"
                    rounded
                    @click="onOpenCreateDialog"
                />
            </div>
        </div>

        <div class="flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 gap-6">
                
                <CourtAdminCard 
                    v-for="court in courts" 
                    :key="court.id"
                    :court="court"
                    :actions="courtActions"
                    @actionClick="({ btn, court, event }) => btn.action?.(court, event)"
                />

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