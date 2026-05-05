<script setup lang="ts">
import { BaseButton } from 'ui';
import { InputText } from 'primevue';

const city = defineModel<string>('city');
const duration = defineModel<number>('duration');

</script>

<template>
    <div class="flex flex-col sm:flex-row gap-3 items-center">

            <div class="w-full sm:w-48">
                <InputText 
                    id="city" 
                    v-model="city"
                    variant="filled" 
                    placeholder="Ciudad" 
                    class="w-full"
                />
            </div>

            <div class="flex gap-2">
                <BaseButton
                    v-for="time in [60,90]" 
                    :key="time"
                    @click="duration = time"
                    :class="[
                        'px-4 py-2 rounded-lg font-semibold text-sm transition-all',
                        duration === time 
                            ? '!bg-[#C8E794] !text-[#344533] !shadow-md !border-none' 
                            : '!bg-white !text-gray-600 hover:!bg-gray-50 border !border-gray-200'
                    ]"
                >
                    {{ time }} min
                </BaseButton>
            </div>
            
        </div>
</template>