<script setup lang="ts">
import type { Reservation } from '@/modules/reservation/interfaces';
import { computed } from 'vue';

const props = defineProps<{ reservation: Reservation }>();

const dateObj = computed(() => new Date(props.reservation.date));
const day = computed(() => dateObj.value.getDate());
const month = computed(() => dateObj.value.toLocaleString('es-ES', { month: 'short' }));
</script>

<template>
    <div class="flex items-center gap-4 p-4 bg-white border border-slate-100 !rounded-2xl !hover:border-[#C8E794] transition-colors">
        <div class="!bg-[#94C8E7] text-black p-3 rounded-xl flex flex-col items-center min-w-[60px]">
            <span class="text-xs uppercase font-bold">{{ month }}</span>
            <span class="text-xl font-black">{{ day }}</span>
            </div>
        
        <div class="flex-1">
            <h4 class="font-bold text-slate-800">{{ reservation.clubId }}</h4>
            <p class="text-sm text-slate-500">{{ reservation.courtId }} • {{ reservation.startTime }}h - {{ reservation.endTime }}</p>
        </div>

        <div class="text-right">
            <p class="text-lg font-black text-slate-900">{{ reservation.totalPrice }}€</p>
            <span class="text-[10px] uppercase font-bold text-slate-400">Confirmada</span>
        </div>
    </div>
</template>