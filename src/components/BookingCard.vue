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
        class="!flex-col sm:!flex-row !gap-4 hover:!border-[#C8E794] !transition-colors !shadow-md !rounded-3xl"
    >
        <div class="flex items-center gap-4 w-full">
            <div class="!bg-[#94C8E7] text-black p-3 rounded-2xl flex flex-col items-center min-w-[60px] shadow-inner">
                <span class="text-xs uppercase font-bold tracking-wider">{{ month }}</span>
                <span class="text-2xl font-black">{{ day }}</span>
            </div>
            
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-900 text-lg truncate">{{ reservation.clubName }}</h4>
                <p class="text-sm text-slate-500 mt-0.5 truncate">
                    {{ reservation.courtName }} • {{ reservation.startTime }}h - {{ reservation.endTime }}
                </p>
            </div>
        </div>

        <div class="border-t border-slate-100 -mx-4 sm:hidden"></div>

        <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
            <p class="text-2xl sm:text-lg font-black text-slate-950">{{ reservation.price.totalPrice }}€</p>
            <span class="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full tracking-wide">
                {{ STATUS_TRANSLATION[reservation.status.id] }}
            </span>
        </div>
    </BaseCard>
</template>