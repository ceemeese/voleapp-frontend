<script setup lang="ts">
import { formatFullDate } from '@/helpers/dateHelpers';
import type { ReservationDataDialog } from '@/modules/reservation/interfaces';

const props = defineProps<{
    reservation: ReservationDataDialog | null;
}>();

</script>

<template>
   <div v-if="props.reservation" class="flex flex-col gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"> 
        <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase">Club</span>
            <span class="font-bold text-slate-800">{{ props.reservation.clubName }}</span>
        </div>
        
        <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase">Pista</span>
            <span class="font-bold text-slate-800">{{ props.reservation.courtName }} ({{ props.reservation.courtType }})</span>
        </div>

        <hr class="border-slate-200" />

        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
                <p class="font-semibold text-slate-700">{{ props.reservation.date }}</p>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Horario</p>
                <p class="font-semibold text-slate-700">{{ props.reservation.startTime }} - {{ props.reservation.endTime }}</p>
            </div>
        </div>

        <div class="mt-2 pt-4 border-t border-dashed flex justify-between items-center">
            <span class="font-bold text-slate-600">Total a pagar</span>
            <span class="text-2xl font-black text-[#344533]">{{ props.reservation.price }}€</span>
        </div>

        <div v-if="props.reservation.createdAt" class="text-center mt-2">
            <p class="text-[10px] text-slate-400 font-medium italic">
                Reserva realizada el {{ formatFullDate(props.reservation.createdAt) }}
            </p>
        </div>
    </div>
</template>