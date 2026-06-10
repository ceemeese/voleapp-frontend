<script setup lang="ts">
import type { Club } from '@/modules/club/interfaces';
import { BasePill, type BaseCard, type BaseDataTable,  type ColumnConfig } from 'ui';
import { clubInputsDialog, clubSchema, type ClubAddFormData, type ClubUpdateFormData } from '@/modules/club/schemas/club.schema';
import { RouteNames } from '@/router/routeNames';

const confirmPopup = useConfirm();
const toast = useToast();
const authStore = useAuthStore();
const clubStore = useClubStore();
const router = useRouter();
const { getClubs, isLoading, toggleStatusClub, createClub, updateClub, getAdminContext } = useClub();

const clubs = ref<Club[]>([]);
const selectedClub = ref<Club | undefined>();
const clubDialogRef = ref();
const resolverClub = zodResolver(clubSchema);

const loadClubs = async () => {
    try {
        clubs.value = await getClubs();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ 
            severity: 'error', 
            summary: 'Error de acceso', 
            detail: message, 
            life: 3000 
        });
    }
};


const headerColumns : ColumnConfig<Club>[] = [
    { field: 'name', header: 'Club', sortable: true },
    { field: 'cif', header: 'CIF', sortable: false },
    { field: 'city', sortField: 'address.city', header: 'Ciudad', sortable: true },
    { field: 'createdAt', header: 'Alta', sortable: false },
    { field: 'isActive', header: 'Estado', sortable: false },
    { 
        field: 'actions', 
        header: '', 
        sortable: false, 
        actions: [
             {
                isVisible: true,
                icon: 'pi pi-pencil',
                class: '!text-blue-600',
                action: (club: Club) => {
                    selectedClub.value = club; 
                    const clubDataForm : ClubUpdateFormData = {
                        name: club.name,
                        cif: club.cif,
                        email: club.email,
                        phoneNumber: club.phoneNumber,
                        street: club.address.street,
                        city: club.address.city,
                        zipCode: club.address.zipCode,
                        country: club.address.country,
                    }
                    clubDialogRef.value.open(clubDataForm);
                }
            },
            {
                isVisible: true,
                icon: (club: Club) => club.isActive ? 'pi pi-trash' : 'pi pi-refresh',
                class: (club: Club) => club.isActive ? '!text-red-600' : 'text-green-600',
                action: (club, event) => handleToggleStatus(club, event)
            },
            {
                isVisible: true,
                icon: 'pi pi-sign-in',
                class: 'text-purple-600',
                action: (club: Club) => {
                    handleImpersonate(club);
                }
            }
        ]
    }
]

const handleImpersonate = async (club: Club) => {
    clubStore.activeClubId = club.id;
    
    try {
        await getAdminContext(club.id); 
        
        toast.add({ severity: 'info', summary: 'Simulación iniciada', detail: `Ahora gestionando: ${club.name}`, life: 3000 });
        router.push({ name: RouteNames.ADMIN_DASHBOARD });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo acceder al club' });
    }
}

const handleToggleStatus = (club: Club, event: PointerEvent) => {

    const isActivating = !club.isActive;
    const actionText = isActivating ? 'activar' : 'desactivar';
    const severity = isActivating ? 'success' : 'danger'

    const target = event.currentTarget as HTMLElement;
    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres ${actionText} al club seleccionado?`,
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
                await toggleStatusClub(club);
                
                club.isActive = isActivating;

                toast.add({ severity: 'success', summary: 'Confirmado', detail: `Club ${isActivating ? 'reactivado' : 'desactivado'} con éxito`, life: 3000});

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Error inesperado';
                toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 });
            }
        },
    });
}


const onSaveClub = async (data: ClubAddFormData | ClubUpdateFormData) => {
    try {
        if (selectedClub.value){
            await updateClub(selectedClub.value.id, {
                name: data.name, 
                cif: data.cif,
                street: data.street,
                city: data.city,
                zipCode: data.zipCode,
                country: data.country,
                phoneNumber: data.phoneNumber,
                email: data.email,
            })
            
            const index = clubs.value.findIndex(c => c.id === selectedClub.value?.id);
            if (index !== -1){
                clubs.value[index] = {
                    id: selectedClub.value.id,
                    name: data.name,
                    cif: data.cif,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    isActive: selectedClub.value.isActive,
                    createdAt: selectedClub.value.createdAt,
                    address: {
                        street: data.street,
                        city: data.city,
                        zipCode: data.zipCode,
                        country: data.country
                    }
                };
            }
            
            toast.add({ severity: 'success', summary: 'Confirmado', detail: `Club modificado con éxito`, life: 3000});
        } else {
            const newClub: Club = await createClub({ 
                name: data.name, 
                cif: data.cif,
                street: data.street,
                city: data.city,
                zipCode: data.zipCode,
                country: data.country,
                phoneNumber: data.phoneNumber,
                email: data.email,
            });

            clubs.value.unshift(newClub);
            
            toast.add({ severity: 'success', summary: 'Confirmado', detail: `Club creado con éxito`, life: 3000});
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 });
    }
}


const onOpenCreateDialog = () => {
    selectedClub.value = undefined;
    clubDialogRef.value.open();
}


onMounted(async () => {
    if (authStore.isSuperadmin){
        await loadClubs();
    }
})


</script>

<template>
    <div class="p-6 min-h-screen">
        <div class="mb-4 flex justify-between items-center">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Gestión de Clubes</h2>
                <p class="text-xs text-slate-500">Administra los centros dados de alta en VoleApp</p>
            </div>
        </div>

        <BaseCard padding="p-4">
            <BaseDataTable
            :value="clubs"
            :columns="headerColumns"
            :loading="isLoading"
            :show-search="true"
            :globalFilterFields="['name', 'email', 'address.city', 'cif']"
            :removable-sort="true"
            :rows="7"
            :paginator="true"
            >
                <template #table-actions>
                    <BaseButton icon="pi pi-plus" size="small" rounded label="Nuevo Club" class="!bg-black !border-none" @click="onOpenCreateDialog"/>
                </template>

                <template #name="{ data }">
                    <div class="flex items-center gap-3">
                        
                        <div class="flex flex-col">
                            <div class="flex flex-col">
                                <span class="font-bold text-slate-700">
                                    {{ data.name }}
                                </span>
                                <span class="text-xs text-slate-400">{{ data.email }}</span>
                            </div>
                        </div>
                    </div>
                </template>

                <template #city="{ data }">
                    <div class="flex flex-col">
                        <span class="font-medium text-slate-700">{{ data.address.city }}</span>
                        <span class="text-xs text-slate-400 truncate max-w-[180px]">{{ data.address.street }}</span>
                    </div>
                </template>

                <template #createdAt="{ data }">
                    <span class="text-sm">{{ toDateOnlyString(data.createdAt) }}</span>
                </template>

                <template #isActive="{ data }">
                    <BasePill 
                        :text="data.isActive ? 'Activo' : 'Inactivo'"
                        :type="data.isActive ? 'success' : 'inactive'"
                    />
                </template>

            </BaseDataTable>

            <BaseDialog
                ref="clubDialogRef"
                :header="selectedClub ? 'Editar club' : 'Crear club'"
                :subtitle="selectedClub ? 'Modifique los datos del centro' : 'Rellene los campos solicitados'"
                :resolver="resolverClub"
                :inputs-dialog="clubInputsDialog"
                @save="onSaveClub"
                />
        </BaseCard>
    </div>
</template>