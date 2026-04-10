<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { BaseCard, BaseInfoField, UserCardProfile } from 'ui';
import type { InfoFieldProps, BaseInputProps } from 'ui';
import { useClub } from '@/composables/useClub';
import { COUNTRY_FLAGS_DATA, getCountryFlag, getCountryName } from '@/utils/country-utils';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateClubSchema } from '../schemas/updateClub.schema';
import type { Club } from '../interfaces';
import { useClubStore } from '@/stores/clubStore';

const clubStore = useClubStore();
const toast = useToast();
const errorMessage = ref<string>('');
const clubDialogRef = ref();
const resolver = zodResolver(updateClubSchema);
const { activeClubId, currentClubInfo, getAdminContext, updateClub } = useClub();

const inputsDialog : BaseInputProps[] = [
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

onMounted(async () => {
    if (activeClubId.value) {
        await getAdminContext();
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
    
    return new Date(dateRaw!).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    });
   
});

//aplanar objeto para poder mostrar dirección
const handleOpenEdit = () => {
    const clubDataForm = {
        ...currentClubInfo.value,
        street: currentClubInfo.value?.address.street,
        city: currentClubInfo.value?.address.city,
        zipCode: currentClubInfo.value?.address.zipCode,
        country: currentClubInfo.value?.address.country,
    }
    clubDialogRef.value.open(clubDataForm);
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
    <div class="mx-auto w-full h-full max-w-7xl p-4">
        <UserCardProfile 
        :main-text="currentClubInfo?.name"
        :subtext="locationSubtext"
        :initials="clubInitials"
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

        <BaseDialog
            ref="clubDialogRef"
            header="Editar club"
            subtitle="Actualiza la información de tu club"
            :resolver="resolver"
            :inputs-dialog="inputsDialog"
            @save="onSaveModifiedClub"
            />

    </div>

</template>