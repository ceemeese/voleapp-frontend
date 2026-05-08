<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';
import { UserCardProfile } from 'ui';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateUserSchema } from '../schemas/updateUser.schema';
import { BaseDialog } from 'ui';
import type { User } from '../interfaces';
import { useUser } from '@/composables/useUser';
import type { BaseCard, BaseInfoField, BaseInputProps, InfoFieldProps } from 'ui';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const toast = useToast();
const errorMessage = ref<string>('');
const resolver = zodResolver(updateUserSchema);
const userDialogRef = ref();
const { updateUser } = useUser();
const { profile } = storeToRefs(userStore);


const inputsDialog : BaseInputProps[] = [
    { field: 'username', label: 'Apodo', icon: 'pi pi-user' },
    { field: 'email', label: 'Email', icon: 'pi pi-envelope', type: 'email' },
    { field: 'phoneNumber', label: 'Teléfono', icon: 'pi pi-phone' },
]

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
            errorMessage.value = message;
            toast.add({ 
                severity: 'error', 
                summary: 'Error de acceso', 
                detail: errorMessage.value,
                life: 5000 
            });
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


const onSaveModifiedUser = async (updatedData: User) => {
    try {
        await updateUser(profile.value!.id, {
            username: updatedData.username,
            email: updatedData.email,
            phoneNumber: updatedData.phoneNumber
        });

        userStore.profile = {...profile.value, ...updatedData}

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
    <div class="mx-auto w-full h-full">
        <UserCardProfile 
        :main-text="userFullName"
        :subtext="'@' + (profile?.username) || ''"
        :initials="userInitials"
        size="xlarge"
        shape="circle"
        @edit="handleOpenEdit"
        padding="p-2"
        >
    
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
            :inputs-dialog="inputsDialog"
            @save="onSaveModifiedUser"
            />

    </div>

</template>