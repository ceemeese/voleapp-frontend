<script setup lang="ts">
import { BaseInput } from 'ui';

const pricingConfig = defineModel<{
    coldThreshold: number;
    hotThreshold: number;
    windThreshold: number;
    discountRain: number;
    discountCold: number;
    discountWind: number;
    extraHot: number;
}>('pricingConfig', { required: true });

</script>

<template>
    <h2 class="text-xl font-black text-slate-800 uppercase italic tracking-tight mb-10">Configuración de Precios Dinámicos</h2>
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
                                class="!p-2 font-bold focus:!border-slate-400" />
                        </div>
                        <div class="flex-1">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-cold">Dto. (%)</label>
                            <BaseInput 
                                id="discount-cold"
                                v-model="pricingConfig.discountCold"
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400" />
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
                                v-model="pricingConfig.hotThreshold" 
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400" />
                        </div>
                        <div class="flex-1">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-heat">Dto (%)</label>
                            <BaseInput 
                            id="discount-heat"
                            v-model="pricingConfig.extraHot" 
                            type="number" 
                            class="!p-2 font-bold focus:!border-slate-400" />
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
                                class="!p-2 font-bold focus:!border-slate-400" />
                        </div>
                        <div class="flex-1">
                            <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-wind">Dto. (%)</label>
                            <BaseInput 
                                id="discount-wind"
                                v-model="pricingConfig.discountWind" 
                                type="number" 
                                class="!p-2 font-bold focus:!border-slate-400" />
                        </div>
                    </div>
                </div>
                <div class="space-y-1">
                    <p class="text-[9px] font-bold text-slate-400 uppercase italic">Ajuste por lluvia</p>
                    <div class="flex flex-col">
                        <label class="text-[10px] font-black text-slate-800 uppercase block" for="discount-rain">Dto. (%)</label>
                        <BaseInput 
                            id="discount-rain"
                            v-model="pricingConfig.discountRain" 
                            type="number" 
                            class="!p-2 font-bold focus:!border-slate-400" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>