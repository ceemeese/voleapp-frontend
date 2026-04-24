<script setup lang="ts">
import { useUser } from '@/composables/useUser';
import { onMounted } from 'vue';
import { ref } from 'vue';
import type { User } from '../interfaces';
import { useAuthStore } from '@/stores/authStore';
import { BaseDataTable } from 'ui';
import type { BaseCard, BaseInputProps, ColumnConfig } from 'ui';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { BaseDialog } from 'ui';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateUserSchema } from '../schemas/updateUser.schema';


const { getUsers, deactivateUser, updateUser } = useUser();
const userStore = useAuthStore()
const users = ref<User[]>([]);
const confirmPopup = useConfirm();
const toast = useToast();
const errorMessage = ref('');
const userDialogRef = ref();
const selectedUser = ref<User>();
const resolver = zodResolver(updateUserSchema);

const inputsDialog : BaseInputProps[] = [
    { field: 'username', label: 'Apodo', icon: 'pi pi-user' },
    { field: 'email', label: 'Email', icon: 'pi pi-envelope', type: 'email' },
    { field: 'phoneNumber', label: 'Teléfono', icon: 'pi pi-phone' },
]

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
                //to: (user) => ({name: 'user-edit', params: { id: user.id}}),
                class: '!text-blue-600',
                action: (user) => {
                    selectedUser.value = {...user};
                    userDialogRef.value.open(selectedUser.value);
                }
            },
            {
                isVisible: (user) => user.username !== 'superadmin' && user.isActive,
                icon: 'pi pi-trash',
                class: '!text-red-600',
                action: (user, event) => handleDeactivate(user, event)
            }
        ]
    }
]


onMounted(async () => {
    if (userStore.isSuperadmin) {
        users.value = await getUsers();
    }
})

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

const handleDeactivate = (user: User, event: PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres desactivar a @ ${user.username}?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        } ,
        acceptProps: {
            label: 'Aceptar'
        },
        accept: async () => {
            try {
                await deactivateUser(user.id)

                user.isActive = false;

                toast.add({ 
                    severity: 'info', 
                    summary: 'Confirmado', 
                    detail: 'Usuario desactivado', 
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
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', data.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700']"
                >
                    {{ data.isActive ? 'Activo' : 'Inactivo' }}
                </span>
            </template>
        </BaseDataTable>

         <BaseDialog
            ref="userDialogRef"
            header="Editar usuario"
            subtitle="Actualiza la información del usuario seleccionado"
            :resolver="resolver"
            :inputs-dialog="inputsDialog"
            :model-value="selectedUser"
            @save="onSaveModifiedUser"
            />
    </BaseCard>
</template>