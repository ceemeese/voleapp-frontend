<script setup lang="ts">
import type { UserClub } from '@/modules/club/interfaces';
import { BaseCard } from 'ui';

const props = defineProps<{ club: UserClub }>();
const emit = defineEmits<{ (e: 'toggleFavourite', clubId: string): void }>();

</script>

<template>
    <BaseCard
        padding="p-4"
        class="!flex-col sm:!flex-row !gap-4 hover:!border-[#C8E794] !transition-colors !shadow-md !rounded-3xl"
    >
        <div class="flex items-center gap-4 w-full">

            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-900 text-lg truncate">{{ club.clubName }}</h4>
                <p v-if="props.club.membershipNumber" class="text-sm font-mono text-slate-500 mt-0.5 truncate">
                    Nº {{ club.membershipNumber }}
                </p>
            </div>
        </div>

        <div class="border-t border-slate-100 -mx-4 sm:hidden"></div>

        <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
            <BasePill 
                :type="club.isMember ? 'success' : 'inactive'" 
                :text="club.isMember ? 'Socio' : 'Jugador'"
                :dot="club.isActive"
            />
            <BaseButton
                :icon="club.isFavourite ? 'pi pi-heart-fill' : 'pi pi-heart'"
                rounded
                class="!text-gray-400 hover:!text-red-500 hover:!border-red-500 !transition-colors !bg-transparent !cursor-pointer !transition-transform hover:!scale-110 !border-none"
                :class="club.isFavourite ? '!text-red-500' : '!text-slate-400'"
                @click="emit('toggleFavourite', club.clubId)"
            />
        </div>
    </BaseCard>
</template>