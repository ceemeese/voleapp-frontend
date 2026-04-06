<script setup lang="ts">
import { useMember } from '@/composables/useMember';
import type { MemberComplete } from '../interfaces';
import type { BaseCard, ColumnConfig,  BaseInputProps, } from 'ui';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { BaseDialog, BaseButton } from 'ui';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateMemberSchema } from '../schemas/updateMember.schema';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useClub } from '@/composables/useClub'
import { watch } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import { useUser } from '@/composables/useUser'
import type { User } from '@/modules/user/interfaces';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';


interface SelectedMemberType extends Omit<MemberComplete, 'role'> {
    role: string;
}

interface MemberUpdateForm {
    id: number;
    role: string;
    membershipNumber: string;
    isMember: boolean;
}

const ROLE_OPTIONS = [
    {id: 1, name: 'Owner'},
    {id: 2, name: 'Player'},
    {id: 3, name: 'Coach'},
    {id: 4, name: 'Admin'},
];

const confirmPopup = useConfirm();
const { getUserByEmail } = useUser();
const { activeClubId } = useClub();
const resolver = zodResolver(updateMemberSchema);
const toast = useToast();

const { getMembers, deactivateMember, putMember, activateMember, addMember } = useMember();

const members = ref<MemberComplete[]>([]);
const errorMessage = ref<string>('');
const selectedMember = ref<SelectedMemberType | undefined>(undefined);
const memberDialogRef = ref();

const searchDialogRef = ref();
const searchResults = ref<User[]>([]);
const selectedUserToAdd = ref<User>();


const inputsDialog : BaseInputProps[] = [
    { 
        field: 'role', 
        label: 'Rol', 
        icon: 'pi pi-user', 
        type: 'select',
        options: ROLE_OPTIONS,
        optionLabel: 'name',
        optionValue: 'name'
    },
    { field: 'membershipNumber', label: 'Nº Socio', icon: 'pi pi-id-card' },
    { field: 'isMember', label: 'Es socio del club?', icon: 'pi pi-phone', type: 'boolean' },
]

const headerColumns : ColumnConfig<MemberComplete>[] = [
    { field: 'fullName', header: 'Miembro', sortable: false },
    { field: 'membershipNumber', header: 'Nº Socio', sortable: false },
    { field: 'role', header: 'Rol Club', sortable: false },
    { field: 'registeredOn', header: 'Alta', sortable: false },
    { field: 'isActive', header: 'Estado', sortable: false},
    { 
        field: 'actions', 
        header: '', 
        sortable: false, 
        actions: [
            {
                isVisible: true,
                icon: 'pi pi-pencil',
                class: '!text-blue-600',
                action: (member: MemberComplete) => {
                    selectedMember.value = {
                        ...member,
                        role: member.role.name,
                        isMember: member.isMember
                    }
                    
                    memberDialogRef.value.open(selectedMember.value);
                    console.log(selectedMember.value)
                }
            },
            {
                isVisible: true,
                icon: (member: MemberComplete) => member.isActive ? 'pi pi-trash' : 'pi pi-refresh',
                class: (member: MemberComplete) => member.isActive ? '!text-red-600' : 'text-green-600',
                action: (member, event) => handleToggleStatus(member, event)
            }
        ]
    }
]


onMounted(async () => {
    if (activeClubId.value){
        await loadMembers();
    }
});

watch(activeClubId, async(newId) => {
    if (newId && members.value.length === 0) {
        await loadMembers();
    }
})

const loadMembers = async () => {
    try {
        const rawMembers = await getMembers(activeClubId.value!);
        members.value = rawMembers.map(member => ({
            ...member,
            fullname: `${member.name} ${member.lastName}`
        }))
        console.log('Miembros', members.value);
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


const onSaveModifiedMember = async (updatedData: MemberUpdateForm) => {
    const memberId = selectedMember.value?.userId;
    
    try {
        await putMember(activeClubId.value!, memberId!, {
            role: updatedData.role,
            membershipNumber: updatedData.membershipNumber,
            isMember: updatedData.isMember
        });

        const roleObj = ROLE_OPTIONS.find(r => r.name === updatedData.role);

        const index = members.value.findIndex(m => m.id === updatedData.id);
        if (index !== -1) {
            const original = members.value[index];

            members.value[index] = {
                ...original, 
                ...updatedData,
                role: {
                    id: roleObj?.id || original?.role.id,
                    name: updatedData.role
                }
            } as MemberComplete;
        }
        
        toast.add({ 
            severity: 'info', 
            summary: 'Confirmado', 
            detail: 'Usuario modificado', 
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

const onOpenSearchMember = () => {
    selectedUserToAdd.value = undefined;
    searchDialogRef.value.open();
}

const searchUsers = async (event: AutoCompleteCompleteEvent) => {
    const query = event.query;

    if (query.length < 5) return;
    try {
        const data = await getUserByEmail(query);
        searchResults.value = [data];
    } catch (error: unknown) {
        searchResults.value = [];
        console.log(error);
    }
}

const onAddMemberToClub = async () => {
    if (!selectedUserToAdd.value || typeof selectedUserToAdd.value === 'string') {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un usuario de la lista' });
        return;
    }

    try {
        await addMember(activeClubId.value!, {   
            userId:selectedUserToAdd.value?.id, 
            role:'Player' 
        });
        console.log('USUARIOOOO CREADO');
        
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



const handleToggleStatus = (member: MemberComplete, event: PointerEvent) => {
    console.log('usuario:', member.id)

    const isActivating = !member.isActive;
    const actionText = isActivating ? 'activar' : 'desactivar';
    const severity = isActivating ? 'success' : 'danger'

    const target = event.currentTarget as HTMLElement;
    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres ${actionText} al miembro seleccionado del club?`,
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
                    await activateMember(activeClubId.value!, member.userId)
                } else {
                    await deactivateMember(activeClubId.value!, member.userId)
                }
                
                member.isActive = isActivating;

                toast.add({ 
                    severity: 'info', 
                    summary: 'Confirmado', 
                    detail: `Miembro ${isActivating ? 'reactivado' : 'desactivado'} con éxito`, 
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
    <BaseCard padding="ui:p-4">
        <BaseDataTable
        :value="members"
        :columns="headerColumns"
        :show-search="true"
        :globalFilterFields="['fullname', 'email', 'membershipNumber', 'fullName']"
        :removable-sort="true"
        :rows="7"
        :paginator="true"
        >

            <template #table-actions>
                <BaseButton icon="pi pi-plus" size="small" rounded label="Añadir miembro" outlined @click="onOpenSearchMember"/>
            </template>

            <template #fullName="{ data }">
                <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-700">
                            {{ data.fullname }}
                        </span>
                        <span class="text-xs text-slate-400">{{ data.email }}</span>
                    </div>
                    <i v-if="data.isFavourite" class="pi pi-star-fill text-yellow-500 text-xs"></i>
                </div>
            </template>
            

            <template #membershipNumber="{ data }">
                <span v-if="data.membershipNumber" class="font-mono bg-slate-100 px-2 py-1 rounded text-blue-700 text-sm">
                    #{{ data.membershipNumber }}
                </span>
                <span v-else class="text-slate-300 italic text-xs">No asignado</span>
            </template>

            <template #role="{ data }">
                <span class="text-sm text-slate-600">
                    {{ data.role.name }}
                </span>
            </template>

            <template #registeredOn="{ data }">
                <span class="text-sm">
                    {{ new Date(data.registeredOn).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    }) }}
                </span>
            </template>

            <template #isActive="{ data }">
                <div class="flex items-center w-32">
                    <div v-if="data.isActive && data.isMember" 
                        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        <i class="pi pi-verified text-[10px]"></i>
                        <span class="text-[10px] uppercase font-black tracking-wider">Socio</span>
                    </div>

                    <div v-else-if="data.isActive && !data.isMember" 
                        class="px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-100">
                        <span class="text-[10px] uppercase font-black tracking-wider">Jugador</span>
                    </div>

                    <div v-else 
                        class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        <span class="text-[10px] uppercase font-black tracking-wider">Baja / Inactivo</span>
                    </div>
                </div>
            </template>
        </BaseDataTable>

        <BaseDialog
            ref="searchDialogRef"
            header="Añadir nuevo miembro"
            @save="onAddMemberToClub"
        >
            <div class="flex flex-col gap-4">
                <AutoComplete 
                    v-model="selectedUserToAdd" 
                    :suggestions="searchResults" 
                    @complete="searchUsers" 
                    optionLabel="email" 
                    placeholder="Escribe el email del usuario..."
                    fluid
                    autofocus
                    :force-selection="true"
                >
                    <template #option="slotProps">
                        <div class="flex flex-col">
                            <span class="font-bold">{{ slotProps.option.name }} {{ slotProps.option.lastName }}</span>
                            <span class="text-xs text-slate-500">{{ slotProps.option.email }}</span>
                        </div>
                    </template>
                </AutoComplete>
                <div class="h-5 flex items-center "> 
                    <Transition name="fade">
                        <p v-if="selectedUserToAdd?.id" 
                        class="w-full text-xs text-blue-600 p-2.5 rounded-lg border-blue-100">
                            <i class="pi pi-info-circle mr-1"></i>
                            Se añadirá a este usuario con el rol por defecto (<strong>Player</strong>).
                        </p>
                    </Transition>
                </div>
            </div>
        </BaseDialog>

        <BaseDialog
            ref="memberDialogRef"
            header="Editar miembro de club"
            subtitle="Actualiza la información del miembro seleccionado"
            :resolver="resolver"
            :inputs-dialog="inputsDialog"
            :model-value="selectedMember"
            @save="onSaveModifiedMember"
            />

    </BaseCard>
</template>