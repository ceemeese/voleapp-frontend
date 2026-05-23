<script setup lang="ts">
import { ref, onMounted} from 'vue';
import PriceConfigForm from '@/components/PriceConfigForm.vue';
import PriceSimulator from '@/components/PriceSimulator.vue';
import { useToast } from 'primevue/usetoast';
import { useClub } from '@/composables/useClub';
import { useCourt } from '@/composables/useCourt';
import type { PricingConfig } from '../interfaces';
import { usePricingConfig } from '@/composables/usePricingConfig';

const toast = useToast();
const { activeClubId } = useClub();
const { courts, getCourtsByClubId } = useCourt();
const { getPricing, updatePricingConfig } = usePricingConfig();
const pricingConfig = ref<PricingConfig>();

const loadCourts = async () => {

    if (courts.value.length > 0) return;
    try {
        await getCourtsByClubId(activeClubId.value!);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        })
    }
}


const loadPricingConfig = async () => {

    try {
        pricingConfig.value = await getPricing(activeClubId.value!);
        console.log(pricingConfig.value, 'PRICINGGGG');
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        })
    }
}


const handleSaveConfig = async (configData: PricingConfig) => {

    if (!activeClubId.value) return;
    try {
        await updatePricingConfig(activeClubId.value, {
            rainDiscountPercent: configData.rainDiscountPercent,
            windThreshold: configData.windThreshold,
            windDiscountPercent: configData.windDiscountPercent,
            heatThreshold: configData.heatThreshold,
            heatDiscountPercent: configData.heatDiscountPercent,
            coldThreshold: configData.coldThreshold,
            coldDiscountPercent: configData.coldDiscountPercent
        })

        toast.add({ 
            severity: 'success', 
            summary: 'Confirmado', 
            detail: 'Cambios guardados', 
            life: 3000});
    } catch (error:unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        })
    }
}

onMounted(async () => {
    if (activeClubId.value){
        await loadCourts();
        await loadPricingConfig();
    }
});

</script>

<template>
    <div class="flex flex-col gap-8 p-4 w-full h-full overflow-y-auto bg-slate-50">
        
        <section class="w-full max-w-5xl mx-auto">
            <BaseCard padding="p-8">
                <PriceConfigForm v-if="pricingConfig"
                :pricing-config="pricingConfig"
                @save="handleSaveConfig"/>
            </BaseCard>
        </section>

        <section class="w-full max-w-5xl mx-auto">
            <BaseCard padding="p-8">
                <PriceSimulator v-if="pricingConfig && courts.length > 0 " 
                :courts="courts"
                :pricing-config="pricingConfig"/>
            </BaseCard>
        </section>
    </div>
</template>