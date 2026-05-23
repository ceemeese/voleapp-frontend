<script setup lang="ts">
import { BaseInput } from 'ui';
import type { BaseInputProps } from 'ui';
import { Slider } from 'primevue';
import ToggleSwitch from 'primevue/toggleswitch';
import Message from 'primevue/message';
import type { Court, PricingConfig } from '@/modules/club/interfaces';
import { computed, ref } from 'vue';
import Tag from 'primevue/tag';

const props = defineProps<{
    courts: Court[];
    pricingConfig: PricingConfig;
}>();

const selectedCourtId = ref<string>(props.courts[0]!.id);
const simTemp = ref(22);
const simWind = ref(5);
const simRain = ref(false);

const courtInputSelector = computed((): BaseInputProps => ({
    field: 'courtId',
    label: 'Pista',
    icon: 'pi pi-table',
    type: 'select',
    placeholder: 'Selecciona una pista',
    options: props.courts.filter(c => c.isActive).map(c => ({ id: c.id, nameCourt: c.name })),
    optionLabel: 'nameCourt',
    optionValue: 'id'
}));


const simulation = computed(() => {
    const court = props.courts.find(c => c.id === selectedCourtId.value);
    if (!court) return { total: 0, appliedDiscount: null, hasMultipleDiscounts: false, isHot: false };

    const base = court.basePrice;
    
const activeDiscounts = [
        { id: 'rain', label: 'Lluvia', val: simRain.value ? props.pricingConfig.rainDiscountPercent : 0 },
        { id: 'wind', label: 'Viento', val: simWind.value >= props.pricingConfig.windThreshold ? props.pricingConfig.windDiscountPercent : 0 },
        { id: 'cold', label: 'Mucho Frío', val: simTemp.value <= props.pricingConfig.coldThreshold ? props.pricingConfig.coldDiscountPercent : 0 },
        { id: 'hot', label: 'Mucho Calor', val: simTemp.value >= props.pricingConfig.heatThreshold ? props.pricingConfig.heatDiscountPercent : 0 }
    ].filter(d => d.val > 0);


    const bestDiscount = activeDiscounts.length > 0 
        ? activeDiscounts.reduce((prev, curr) => (prev.val > curr.val) ? prev : curr)
        : null;

    const discountAmount = bestDiscount ? (base * bestDiscount.val) / 100 : 0;

    return {
        total: base - discountAmount,
        appliedDiscount: bestDiscount,
        hasMultipleDiscounts: activeDiscounts.length > 1,
        courtName: court.name
    };
});

</script>

<template>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h2 class="text-xl font-black text-slate-800 uppercase italic tracking-tight">Simulador en tiempo real</h2>
        <div class="w-full md:w-72">
            <BaseInput 
                v-model="selectedCourtId" 
                v-bind="courtInputSelector" 
            />
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-10">
            <div class="flex flex-col">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    Temperatura: <span class="text-[#C8E794]">{{ simTemp }}°C</span>
                </label>
                <Slider v-model="simTemp" :min="-5" :max="45" 
                    :pt="{
                        root: { class: 'bg-slate-700 !h-1.5' },
                        range: { class: '!bg-[#C8E794]' },
                        handle: { class: '!bg-[#C8E794] !border-none !w-5 !h-5 !mt-[-8px] focus:!ring-2 focus:!ring-[#C8E794] focus:!ring-offset-[#C8E794]' }
                    }"
                />
            </div>

            <div class="flex flex-col">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    Viento: <span class="text-[#C8E794]">{{ simWind }} km/h</span>
                </label>
                <Slider v-model="simWind" :min="0" :max="60"
                    :pt="{
                        root: { class: 'bg-slate-700 !h-1.5' },
                        range: { class: '!bg-[#C8E794]' },
                        handle: { class: '!bg-[#C8E794] !border-none !w-5 !h-5 !mt-[-8px] focus:!ring-2 focus:!ring-[#C8E794] focus:!ring-offset-[#C8E794]' }
                    }"
                />
            </div>

            <div class="flex items-center justify-between p-4 bg-black rounded-2xl border border-none">
                <span class="text-[10px] font-black text-white uppercase tracking-wider">Simular lluvia</span>
                <ToggleSwitch v-model="simRain"/>
            </div>
        </div>

        <div class="p-8 border rounded-3xl flex flex-col items-center justify-center text-center min-h-[250px] transition-all duration-300">

            <Message v-if="simulation.hasMultipleDiscounts" severity="info" variant="simple" size="small" class="mb-1">
                <span class="text-[9px] font-bold uppercase italic leading-tight">
                    Info: Se está aplicando únicamente el mayor descuento ({{ simulation.appliedDiscount?.val }}%)
                </span>
            </Message>

            <span class="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-2">
                Tarifa calculada
            </span>

            <div class="flex items-baseline gap-2">
                <span class="text-5xl font-black tracking-tighter">
                    {{ simulation.total.toFixed(2) }}
                </span>
                <span class="text-3xl font-black">€</span>
            </div>

            <div class="mt-6 h-8 flex items-center justify-center relative">
                <Transition
                    mode="out-in"
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-y-4 scale-95"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    
                    leave-active-class="transition duration-200 ease-in absolute"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-to-class="opacity-0 -translate-y-4 scale-95"
                >
                    <Tag 
                        v-if="simulation.appliedDiscount" 
                        :value="`Dto. ${simulation.appliedDiscount.label} (-${simulation.appliedDiscount.val}%)`"
                        severity="info"
                        class="!text-[9px] uppercase !whitespace-nowrap !w-max !animate-fade-in"
                        rounded
                    />

                    <Tag 
                        v-else 
                        value="Ningún descuento aplicado"
                        severity="secondary"
                        class="!text-[9px] uppercase !whitespace-nowrap !w-max !animate-fade-in"
                        rounded
                    />
                  </Transition>
            </div>
        </div>
    </div>
</template>