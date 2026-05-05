<script setup lang="ts">
import { BaseCard, BaseButton } from 'ui';

defineProps<{
    court: {
        time: string;
        price: number | string;
        name: string;
        type: string;
    }
}>();

defineEmits(['reserve']);
</script>

<template>
    <BaseCard class="min-w-[240px] !shadow-md hover:!shadow-xl hover:border-[#C8E794] transition-all duration-300 group cursor-pointer">
        <div class="flex justify-between items-start mb-6">
            <div class="text-3xl font-black text-slate-900 group-hover:text-[#C8E794] transition-colors">
                {{ court.time }}
            </div>
            <div class="text-right">
                <span class="block text-[10px] font-bold text-gray-400 uppercase">Precio</span>
                <span class="text-xl font-black text-slate-900">{{ court.price }}€</span>
            </div>
        </div>

        <div class="space-y-2 mb-6">
            <div class="text-sm font-bold text-slate-700 flex items-center gap-2">
                <i class="pi pi-box text-lime-500"></i>
                {{ court.name }}
            </div>
            <div class="flex gap-2">
                <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-gray-500 uppercase">
                    {{ court.type }}
                </span>
            </div>
        </div>

        <BaseButton 
            label="RESERVAR" 
            size="small"
            @click="$emit('reserve', court)"
            class="w-full !py-1 !font-black !bg-slate-900 group-hover:!bg-[#C8E794] group-hover:!text-black !border-0 transition-colors" 
        />
    </BaseCard>
</template>