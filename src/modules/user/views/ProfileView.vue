<script setup lang="ts">
import { userInputsEditDialog, userSchema } from '../schemas/user.schema';
import type { User } from '../interfaces';
import type { InfoFieldProps } from 'ui';
import { storeToRefs } from 'pinia';
import { passwordInputs, passwordSchema, type UpdatePasswordData } from '../schemas/password.schema';

const userStore = useUserStore();
const toast = useToast();
const resolver = zodResolver(userSchema);
const passwordResolver = zodResolver(passwordSchema);
const userDialogRef = ref();
const passwordDialogRef = ref();
const { updateUser } = useUser();
const { changePassword } = useAuth();
const { profile } = storeToRefs(userStore);
const { isLoading } = useGlobalLoading();


const profileField = computed<InfoFieldProps[]>(() => [
    { label: 'Nombre', value: userStore.profile?.name, icon: 'pi pi-id-card'},
    { label: 'Apellidos', value: userStore.profile?.lastName, icon: 'pi pi-id-card'},
    { label: 'Apodo', value: userStore.profile?.username, icon: 'pi pi-user'},
    { label: 'Número de identificación', value: userStore.profile?.dni, icon: 'pi pi-id-card'},
    { label: 'Email', value: userStore.profile?.email, icon: 'pi pi-envelope'},
    { label: 'Teléfono', value: userStore.profile?.phoneNumber, icon: 'pi pi-phone'}
])

onMounted(async () => {
    if (!profile.value) {
        try {
            await userStore.fetchProfile();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            toast.add({ severity: 'error', summary: 'Error de acceso', detail: message,life: 2000 });
        }
    }
})

const userInitials = computed(() => {
    return profile.value?.username.charAt(0).toUpperCase() || 'U';
})

const userFullName = computed(() => {
    return profile.value
        ? `${profile.value.name} ${profile.value.lastName}`
        : 'Cargando...'
})

const handleOpenEdit = () => {
    userDialogRef.value.open(profile.value);
}

const handleOpenPasswordDialog = () => {
    passwordDialogRef.value.open();
}


const onSaveModifiedUser = async (updatedData: User) => {
    try {
        await updateUser(profile.value!.id, {
            username: updatedData.username,
            email: updatedData.email,
            phoneNumber: updatedData.phoneNumber
        });

        userStore.profile = {...profile.value, ...updatedData}

        toast.add({ severity: 'success', summary: 'Confirmado', detail: 'Usuario modificado', life: 2000});
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    }
    
}

const onSavePassword = async (data: UpdatePasswordData) => {
    try {

        await changePassword(data);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada', life: 2000 });
        passwordDialogRef.value.close();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
    }
}


const formattedDate = computed(() => {
    const dateRaw = profile.value?.createdAt; 
    if (!dateRaw) return '...';

    return new Date(dateRaw!).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    });
   
});

</script>


<template>
    <div class="mx-auto w-full h-full p-6 xl:p-4">
        <UserCardProfile 
            :main-text="userFullName"
            :subtext="'@' + (profile?.username) || ''"
            :initials="userInitials"
            size="xlarge"
            shape="circle"
            @edit="handleOpenEdit"
            padding="p-2"
        >
            <template #actions>
                <div class="flex gap-2">
                    <BaseButton 
                        icon="pi pi-user-edit" 
                        @click="handleOpenEdit" 
                        rounded 
                        size="small" 
                        class="!bg-black !border-none"/>
                    
                    <BaseButton 
                        icon="pi pi-key" 
                        @click="handleOpenPasswordDialog" 
                        rounded
                        size="small"
                        class="!bg-black !border-none"
                    />
                </div>
            </template>
    
        </UserCardProfile>

        <BaseCard class="p-6 mt-3">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-bold text-slate-800">Información Personal</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                
                <BaseInfoField
                    v-for="field in profileField"
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

         <BaseDialog
            ref="userDialogRef"
            header="Editar usuario"
            subtitle="Actualiza la información de usuario"
            :resolver="resolver"
            :inputs-dialog="userInputsEditDialog"
            @save="onSaveModifiedUser"
            :loading="isLoading"
        />

        <BaseDialog
            ref="passwordDialogRef"
            header="Cambiar contraseña"
            subtitle="Introduce tu contraseña actual y la nueva"
            :resolver="passwordResolver"
            :inputs-dialog="passwordInputs"
            @save="onSavePassword"
            :loading="isLoading"
        />

    </div>

</template>