<script setup lang="ts">
import type { PricingConfig } from '../interfaces';

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
    <div class="flex flex-col overflow-hidden h-full w-full p-6 space-y-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Configurador y simulador de precios</h2>
                <p class="text-sm text-slate-500">Optimiza la rentabilidad de tus pistas mediante precios dinámicos</p>
            </div>
        </div>

    <div class="flex flex-col gap-8 w-full h-full overflow-y-auto">
        
        <section class="w-full mx-auto">
            <BaseCard padding="p-8">
                <PriceConfigForm v-if="pricingConfig"
                :pricing-config="pricingConfig"
                @submit="handleSaveConfig" />
            </BaseCard>
        </section>

        <section class="w-full mx-auto">
            <BaseCard padding="p-8">
                <PriceSimulator v-if="pricingConfig && courts.length > 0 " 
                :courts="courts"
                :pricing-config="pricingConfig"/>
            </BaseCard>
        </section>
    </div>
    </div>
</template>