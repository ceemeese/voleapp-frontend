<script setup lang="ts">
import { formatFullDate } from '@/helpers/dateHelpers';
import type { ReservationDataDialog } from '@/modules/reservation/interfaces';
import { BaseCard } from 'ui';

const props = defineProps<{
    reservation: ReservationDataDialog | null;
}>();

</script>

<template>
   <BaseCard v-if="props.reservation" class="flex flex-col gap-4 !bg-slate-100">
        
        <div class="flex items-center gap-3 pb-2 border-b border-slate-50">
            <div class="p-2 rounded-lg">
                <i class="pi pi-ticket"></i>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase leading-none">Detalles de la</p>
                <h3 class="text-lg font-black text-slate-800 uppercase leading-tight">Reserva</h3>
            </div>
        </div>

        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Club</span>
                <span class="text-sm font-bold text-slate-800">{{ props.reservation.clubName }}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Pista</span>
                <span class="text-sm font-bold text-slate-800">{{ props.reservation.courtName }}</span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 p-3 rounded-xl">
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
                <p class="text-xs font-black text-slate-700">{{ props.reservation.date }}</p>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Horario</p>
                <p class="text-xs font-black text-slate-700">{{ props.reservation.startTime }} - {{ props.reservation.endTime }}</p>
            </div>
        </div>

        <div class="pt-2 space-y-2">
            <template v-if="props.reservation.price.appliedDiscountPercent > 0">
                <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-500 font-medium">Precio base</span>
                    <span class="text-slate-500 line-through">{{ props.reservation.price.basePrice.toFixed(2) }}€</span>
                </div>
                <div class="flex justify-between items-center text-xs text-red-500 font-bold">
                    <span>Descuento ({{ props.reservation.price.appliedDiscountPercent }}%)</span>
                    <span>-{{ props.reservation.price.discountAmount.toFixed(2) }}€</span>
                </div>
            </template>

            <div class="pt-3 border-t border-dashed border-slate-200 flex justify-between items-end">
                <div>
                    <p class=" font-black text-slate-400 uppercase leading-none">Total a pagar</p>
                    <p v-if="props.reservation.price.discountReason" class="text-[10px] text-[#A7D16A] font-bold italic mt-1">
                        * {{ props.reservation.price.discountReason }}
                    </p>
                </div>
                <span class="text-3xl font-black text-slate-900 leading-none">
                    {{ props.reservation.price.totalPrice.toFixed(2) }}<span class="text-lg">€</span>
                </span>
            </div>
        </div>

        <div v-if="props.reservation.createdAt" class="mt-2 pt-2 border-t border-slate-50 text-center">
            <p class="text-[10px] text-slate-400 font-medium italic">
                Reserva generada el {{ formatFullDate(props.reservation.createdAt) }}
            </p>
        </div>
   </BaseCard>
</template>