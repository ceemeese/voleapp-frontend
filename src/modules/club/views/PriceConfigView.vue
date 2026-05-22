<script setup lang="ts">
import { ref } from 'vue';
import PriceConfigForm from '@/components/PriceConfigForm.vue';
import PriceSimulator from '@/components/PriceSimulator.vue';
import type { Court } from '../interfaces';

const courts = ref<Court[]>([
    { 
        id: "1", 
        clubId: "1a", 
        name: 'Pista Central', 
        type: { id: 1, name: "indoor" }, 
        basePrice: 35, 
        isActive: true, 
        createdAt: new Date() 
    },
]);

const config = ref({
    basePrice: 25.00,
    
    coldThreshold: 10,
    hotThreshold: 30,
    windThreshold: 20,
    
    discountRain: 15,
    discountCold: 10,
    discountWind: 5,
    extraHot: 5,
    
    simTemp: 22,
    simWind: 5,
    simRain: false
});


</script>

<template>
    <div class="flex flex-col gap-8 p-4 w-full h-full overflow-y-auto bg-slate-50">
        
        <section class="w-full max-w-5xl mx-auto">
            <BaseCard padding="p-8">
                <PriceConfigForm 
                :pricing-config="config"/>
            </BaseCard>
        </section>

        <section class="w-full max-w-5xl mx-auto">
            <BaseCard padding="p-8">
                <PriceSimulator 
                :courts="courts"
                :pricing-config="config"/>
            </BaseCard>
        </section>
    </div>
</template>