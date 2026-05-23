<script setup lang="ts">
import type { PricingConfig } from '@/modules/club/interfaces';
import { BaseInput } from 'ui';
import { ref } from 'vue';

const pricingConfig = defineModel<PricingConfig>('pricingConfig', { required: true });
const isEditing = ref<boolean>(false);

const emit = defineEmits<{
    (e: 'save', priceConfig: PricingConfig): void
}>();

const handleUpdateAction = () => {
    if (isEditing.value) {
        emit('save', pricingConfig.value);
    }
    isEditing.value = !isEditing.value;
};
</script>

<template>
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
            :label="isEditing ? 'Guardar cambios' : 'Editar precios'" 
            :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"
            :severity="isEditing ? 'success' : 'secondary'"
            size="small"
            class="self-end sm:self-auto"
            @click="handleUpdateAction" 
        />
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
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400" 
                                :disabled="!isEditing"/>
                        </div>
                        <div class="flex-1">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-cold">Dto. (%)</label>
                            <BaseInput 
                                id="discount-cold"
                                v-model="pricingConfig.coldDiscountPercent"
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400"
                                :disabled="!isEditing" />
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
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400"
                                :disabled="!isEditing" />
                        </div>
                        <div class="flex-1">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-heat">Dto (%)</label>
                            <BaseInput 
                            id="discount-heat"
                            v-model="pricingConfig.heatDiscountPercent" 
                            type="number" 
                            class="!p-2 font-bold focus:!border-slate-400"
                            :disabled="!isEditing" />
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
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400"
                                :disabled="!isEditing" />
                        </div>
                        <div class="flex-1">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-wind">Dto. (%)</label>
                            <BaseInput 
                                id="discount-wind"
                                v-model="pricingConfig.windDiscountPercent" 
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400"
                                :disabled="!isEditing" />
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
                            type="number" 
                            class="!p-2 font-bold focus:!border-slate-400"
                            :disabled="!isEditing" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>