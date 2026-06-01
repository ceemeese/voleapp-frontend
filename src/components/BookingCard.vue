<script setup lang="ts">
import type { ReservationComplete } from '@/modules/reservation/interfaces';
import { STATUS_TRANSLATION } from '@/utils/status-utils';
import { BaseCard } from 'ui';
import { computed } from 'vue'

const props = defineProps<{ reservation: ReservationComplete }>();

const dateObj = computed(() => new Date(props.reservation.date));
const day = computed(() => dateObj.value.getDate());
const month = computed(() => dateObj.value.toLocaleString('es-ES', { month: 'short' }));
</script>

<template>
    <BaseCard 
    padding="p-4"
    class="!flex-row !items-center !gap-4 hover:!border-[#C8E794] !transition-colors !shadow-md">
        <div class="!bg-[#94C8E7] text-black p-3 rounded-xl flex flex-col items-center min-w-[60px]">
            <span class="text-xs uppercase font-bold">{{ month }}</span>
            <span class="text-xl font-black">{{ day }}</span>
            </div>
        
        <div class="flex-1">
            <h4 class="font-bold text-slate-800">{{ reservation.clubName }}</h4>
            <p class="text-sm text-slate-500">{{ reservation.courtName }} • {{ reservation.startTime }}h - {{ reservation.endTime }}</p>
        </div>

        <div class="text-right">
            <p class="text-lg font-black text-slate-900">{{ reservation.price.totalPrice }}€</p>
            <span class="text-[10px] uppercase font-bold text-slate-400"> {{ STATUS_TRANSLATION[reservation.status.id] }} </span>
        </div>
    </BaseCard>
</template>