<script setup lang="ts">
import { BaseCard, BaseButton } from 'ui';

const props = defineProps<{
    court: {
        id: string;
        name: string;
        type: {
            id: number,
            name: string;
        },
        price: {
        basePrice: number;
        totalPrice: number;
        discountAmount: number;
        appliedDiscountPercent: number;
        discountReason?: string;
        },
    },
    duration: number,
    
}>();

defineEmits(['reserve']);

</script>

<template>
    <BaseCard class="!min-w-60 !p-0 !shadow-sm hover:!shadow-xl hover:border-[#C8E794] transition-all duration-300 group cursor-pointer overflow-hidden h-full relative">
        
        <div v-if="props.court.price.appliedDiscountPercent > 0" 
             class="absolute top-3 right-3 z-10 bg-[#C8E794] text-black text-[10px] font-black px-2 py-1 rounded-full shadow-sm animate-bounce">
            -{{ props.court.price.appliedDiscountPercent }}%
        </div>

        <div class="p-5 flex flex-col h-full">
            
            <div class="mb-4">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-[9px] font-black bg-slate-900 text-[#C8E794] px-2 py-0.5 rounded uppercase">
                        {{ props.court.type.name }}
                    </span>
                    <span class="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <i class="pi pi-clock text-[9px]"></i>
                        {{ props.duration }} min
                    </span>
                </div>
                <h3 class="text-xl font-black text-slate-900 group-hover:text-[#6B8F3A] transition-colors leading-tight min-h-[3rem] mt-2">
                    {{ props.court.name }}
                </h3>
            </div>

            <div class="flex items-end justify-between border-t border-slate-200 pt-4 mb-6">
                <div class="flex flex-col">
                    <span v-if="props.court.price.appliedDiscountPercent > 0" 
                          class="text-xs font-bold text-slate-400 line-through decoration-red-400">
                        {{ props.court.price.basePrice.toFixed(2) }}€
                    </span>
                    
                    <div class="flex items-baseline gap-1">
                        <span class="text-3xl font-black text-slate-900">
                            {{ props.court.price.totalPrice.toFixed(2) }}
                        </span>
                        <span class="text-lg font-bold text-slate-900">€</span>
                    </div>
                    
                    <span v-if="props.court.price.discountReason" 
                          class="text-[9px] font-bold text-[#A7D16A] italic">
                        {{ props.court.price.discountReason }}
                    </span>
                </div>
                
                <div class="flex items-center gap-1.5 text-[#A7D16A] mb-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                    <span class="text-[10px] font-black uppercase">Disponible</span>
                </div>
            </div>

            <div class="mt-auto">
                <BaseButton 
                    label="RESERVAR AHORA" 
                    size="small"
                    @click="$emit('reserve', court)"
                    class="w-full !py-2 !font-black !bg-slate-900 group-hover:!bg-[#C8E794] group-hover:!text-black !border-0 transition-colors" 
                />
            </div>
        </div>
    </BaseCard>
</template>