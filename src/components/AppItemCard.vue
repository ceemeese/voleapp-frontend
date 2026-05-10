<script setup lang="ts">
import { BaseCard, BaseButton } from 'ui';

const props = defineProps<{
    court: {
        id: string;
        name: string;
        basePrice: number | string;
        type: {
            id: number,
            name: string;
        }
    },
    duration: number,
    totalPrice: number
}>();

defineEmits(['reserve']);

</script>

<template>

    <BaseCard class="min-w-[240px] !p-0 !shadow-sm hover:!shadow-xl hover:border-[#C8E794] transition-all duration-300 group cursor-pointer overflow-hidden h-full">
        
        <div class="p-5 flex flex-col h-full">
            
            <div class="mb-4">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-[9px] font-black bg-slate-900 text-[#C8E794] px-2 py-0.5 rounded">
                        {{ props.court.type.name.toUpperCase() }}
                    </span>
                </div>
                <h3 class="text-xl font-black text-slate-900 group-hover:text-[#344533] transition-colors leading-tight min-h-[3rem]">
                    {{ props.court.name }}
                </h3>
            </div>

            <div class="flex items-end justify-between border-t border-slate-50 pt-4 mb-6">
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        Total {{ props.duration }} min
                    </span>
                    <div class="flex items-baseline gap-1">
                        <span class="text-3xl font-black text-slate-900">{{ props.totalPrice }}</span>
                        <span class="text-lg font-bold text-slate-900">€</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-1.5 text-[#A7D16A] mb-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                    <span class="text-[10px] font-black uppercase">Libre</span>
                </div>
            </div>

            <div class="mt-auto">
                <BaseButton 
                    label="RESERVAR" 
                    size="small"
                    @click="$emit('reserve', court)"
                    class="w-full !py-31!font-black !bg-slate-900 group-hover:!bg-[#C8E794] group-hover:!text-black !border-0 transition-colors" 
                />
            </div>
        </div>
    </BaseCard>
</template>