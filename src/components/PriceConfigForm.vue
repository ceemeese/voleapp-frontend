<script setup lang="ts">
import type { PricingConfig } from '@/modules/club/interfaces';
import { BaseInput } from 'ui';
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updatePricingSchema } from '@/modules/club/schemas/updatePricing.schema';
import { Form, type FormSubmitEvent } from '@primevue/forms';

const pricingConfig = defineModel<PricingConfig>('pricingConfig', { required: true });
const isEditing = ref<boolean>(false);
const resolverUpdatePricing = zodResolver(updatePricingSchema);

const emit = defineEmits<{
    (e: 'submit', priceConfig: PricingConfig): void
}>();


const onFormSubmit = (e: FormSubmitEvent) => {
    if (!isEditing.value) return;

    if (e.valid) {
        emit('submit', pricingConfig.value);
        isEditing.value = false;
    }
};

</script>

<template>
    <Form 
        :resolver="resolverUpdatePricing" 
        :initialValues="pricingConfig" 
        @submit="onFormSubmit"
        class="w-full"
        v-slot="$form"
    >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-100 pb-6">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic tracking-tight">
                    Configuración de Precios Dinámicos
                </h2>
                <p class="text-[11px] text-slate-400 font-medium mt-1">
                    {{ isEditing ? 'Estás modificando las reglas de precios del club' : 'Modo lectura. Activa la edición para realizar cambios' }}
                </p>
            </div>

            <BaseButton 
                v-if="!isEditing"
                type="button"
                label="Editar precios" 
                icon="pi pi-pencil"
                severity="secondary"
                size="small"
                @click="isEditing = true"
            />
            <BaseButton 
                v-else
                type="submit"
                label="Guardar cambios" 
                icon="pi pi-check"
                size="small"
                severity="success"
                class="!bg-[#94C8E7] !border-[#94C8E7] !text-slate-900 hover:!bg-[#7cb9de] hover:!border-[#7cb9de]"                    />
        </div>
        <div class="space-y-6">
            <div class="space-y-3">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Temperaturas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-1">
                        <p class="text-[9px] font-bold text-slate-400 uppercase italic">Ajuste por frío</p>
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="text-[10px] font-black text-slate-800 uppercase block" for="threshold-cold">Umbral (°C)</label>
                                <BaseInput
                                    id="threshold-cold"
                                    v-model="pricingConfig.coldThreshold"
                                    name="coldThreshold"
                                    type="number" 
                                    class="!p-2 font-bold focus:!border-slate-400" 
                                    :disabled="!isEditing"
                                    :error="$form.coldThreshold?.error?.message" />
                            </div>
                            <div class="flex-1">
                                <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-cold">Dto. (%)</label>
                                <BaseInput 
                                    id="discount-cold"
                                    v-model="pricingConfig.coldDiscountPercent"
                                    name="coldDiscountPercent"
                                    type="number" 
                                    class="!p-2 font-bold focus:!border-slate-400"
                                    :disabled="!isEditing"
                                    :error="$form.coldDiscountPercent?.error?.message" />
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="text-[9px] font-bold text-slate-400 uppercase italic">Ajuste por calor</p>
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="text-[10px] font-black text-slate-800 uppercase block" for="threshold-heat">Umbral (°C)</label>
                                <BaseInput 
                                    id="threshold-heat"
                                    v-model="pricingConfig.heatThreshold"
                                    name="heatThreshold"
                                    type="number" 
                                    class="!p-2 font-bold focus:!border-slate-400"
                                    :disabled="!isEditing" 
                                    :error="$form.heatThreshold?.error?.message"/>
                            </div>
                            <div class="flex-1">
                                <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-heat">Dto (%)</label>
                                <BaseInput 
                                id="discount-heat"
                                v-model="pricingConfig.heatDiscountPercent"
                                name="heatDiscountPercent"
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400"
                                :disabled="!isEditing" 
                                :error="$form.heatDiscountPercent?.error?.message" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Clima Adverso</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-1">
                        <p class="text-[9px] font-bold text-slate-400 uppercase italic">Ajuste por viento</p>
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="text-[10px] font-black text-slate-800 uppercase block" for="threshold-wind">Viento (km/h)</label>
                                <BaseInput 
                                    id="threshold-wind"
                                    v-model="pricingConfig.windThreshold"
                                    name="windThreshold"
                                    type="number" 
                                    class="!p-2 font-bold focus:!border-slate-400"
                                    :disabled="!isEditing" 
                                    :error="$form.windThreshold?.error?.message" />
                            </div>
                            <div class="flex-1">
                                <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-wind">Dto. (%)</label>
                                <BaseInput 
                                    id="discount-wind"
                                    v-model="pricingConfig.windDiscountPercent"
                                    name="windDiscountPercent" 
                                    type="number" 
                                    class="!p-2 font-bold focus:!border-slate-400"
                                    :disabled="!isEditing" 
                                    :error="$form.windDiscountPercent?.error?.message" />
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="text-[9px] font-bold text-slate-400 uppercase italic">Ajuste por lluvia</p>
                        <div class="flex flex-col">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-rain">Dto. (%)</label>
                            <BaseInput 
                                id="discount-rain"
                                v-model="pricingConfig.rainDiscountPercent" 
                                name="rainDiscountPercent" 
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400"
                                :disabled="!isEditing"
                                :error="$form.rainDiscountPercent?.error?.message" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Form>
</template>