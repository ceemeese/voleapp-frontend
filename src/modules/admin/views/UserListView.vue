<script setup lang="ts">
import { useUser } from '@/composables/useUser';
import { onMounted } from 'vue';
import { ref } from 'vue';
import type { User } from '../../user/interfaces';
import { useAuthStore } from '@/stores/authStore';
import { BaseDataTable, BasePill } from 'ui';
import type { BaseCard, ColumnConfig } from 'ui';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { BaseDialog } from 'ui';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { userInputsEditDialog, userSchema } from '@/modules/user/schemas/user.schema';

const { getUsers, deactivateUser, updateUser, activateUser } = useUser();
const authStore = useAuthStore()
const users = ref<User[]>([]);
const confirmPopup = useConfirm();
const toast = useToast();
const userDialogRef = ref();
const selectedUser = ref<User>();
const resolver = zodResolver(userSchema);
const { isLoading } = useGlobalLoading();

const headerColumns : ColumnConfig<User>[] = [
    { field: 'fullName', header: 'Usuario', sortable: true },
    { field: 'email', header: 'Correo', sortable: false },
    { field: 'isActive', header: 'Estado', sortable: false },
    { 
        field: 'actions', 
        header: '', 
        sortable: false, 
        actions: [
            {
                isVisible: (user) => user.username !== 'superadmin',
                icon: 'pi pi-pencil',
                class: '!text-blue-600',
                action: (user) => handleUserEditDialog(user)
            },
            {
                isVisible: (user) => user.username !== 'superadmin',
                icon: (user) => user.isActive ? 'pi pi-trash' : 'pi pi-refresh',
                class: (user) => user.isActive ? '!text-red-600' : '!text-green-600',
                action: (user, event) => handleToggleUserStatus(user, event)
            }
        ]
    }
]

const handleUserEditDialog = (user: User) => {
    selectedUser.value = {...user};
    userDialogRef.value.open(selectedUser.value);
}


onMounted(async () => {
    if (authStore.isSuperadmin) {
        await loadUsers();
    }
})


const loadUsers = async () => {
    try {
        users.value = await getUsers();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    }
};

const onSaveModifiedUser = async (updatedData: User) => {
    try {
        await updateUser(updatedData.id, {
            username: updatedData.username,
            email: updatedData.email,
            phoneNumber: updatedData.phoneNumber
        });

        const index = users.value.findIndex(u => u.id === updatedData.id);
        if (index !== -1) {
            users.value[index] = {...updatedData}
        }

        toast.add({ severity: 'success', summary: 'Confirmado', detail: 'Usuario modificado', life: 2000});
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    }
    
}

const handleToggleUserStatus = (user: User, event: PointerEvent) => {
    
    const isActivating = !user.isActive;
    const actionText = isActivating ? 'activar' : 'desactivar';
    const severity = isActivating ? 'success' : 'danger'

    const target = event.currentTarget as HTMLElement;
    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres ${actionText} a @${user.username}?`,
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
                if (isActivating){
                    await activateUser(user.id)
                    user.isActive = true;
                } else {
                    await deactivateUser(user.id)
                    user.isActive = false;
                }

                toast.add({ severity: 'success', summary: 'Confirmado', detail: `Usuario ${isActivating ? 'reactivado' : 'desactivado'}`, life: 2000});

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Error inesperado';
                toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
            }
        },
    });
}

</script>

<template>
    <div class="p-6 min-h-screen">
        <div class="mb-4 flex justify-between items-center">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Gestión de Usuarios</h2>
                <p class="text-xs text-slate-500">Administra los usuarios de alta en VoleApp</p>
            </div>
        </div>

        <BaseCard padding="p-4">
            <BaseDataTable
            :value="users"
            :columns="headerColumns"
            :show-search="true"
            :removable-sort="true"
            :rows="7"
            :paginator="true"
            >
                <template #fullName="{ data }">
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-700">{{ data.name }} {{ data.lastName }}</span>
                        <span class="text-xs text-slate-400">@{{ data.username }}</span>
                    </div>
                </template>

                <template #isActive="{ data }">
                    <BasePill 
                        :text="data.isActive ? 'Activo' : 'Inactivo'"
                        :type="data.isActive ? 'success' : 'inactive'"
                    />
                </template>
            </BaseDataTable>

            <BaseDialog
                ref="userDialogRef"
                header="Editar usuario"
                subtitle="Actualiza la información del usuario seleccionado"
                :resolver="resolver"
                :inputs-dialog="userInputsEditDialog"
                :model-value="selectedUser"
                @save="onSaveModifiedUser"
                :loading="isLoading"
                />
        </BaseCard>
    </div>
</template>