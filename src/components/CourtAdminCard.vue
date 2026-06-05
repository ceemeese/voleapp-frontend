<script setup lang="ts">
import type { Court } from '@/modules/club/interfaces';
import type { ActionColumn } from 'ui';

defineProps<{
    court: Court;
    actions: ActionColumn<Court>[];
}>();

defineEmits<{
    (e: 'actionClick', payload: {btn: ActionColumn<Court>; court: Court; event: PointerEvent}): void
}>();


const getActionValue = <T>( 
    value: string | ((data: T) => string) | undefined, 
    item: T
): string => {
    if (!value) return '';
    return typeof value === 'function' ? value(item) : value;
};

const isActionVisible = <T>(
    visible: boolean | ((row: T) => boolean), 
    item: T
): boolean => {
    return typeof visible === 'function' ? visible(item) : visible;
};

</script>

<template>
    <BaseCard 
        class="!shadow-sm hover:!shadow-xl hover:border-[#C8E794] transition-all duration-300 group cursor-pointer overflow-hidden h-full relative bg-white border border-slate-100"
        padding="p-0"
    >
        <template #default>
            <div class="p-5 flex flex-col h-full min-h-[180px]">
                
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-[9px] font-black bg-slate-900 text-[#C8E794] px-2 py-0.5 rounded uppercase">
                            {{ court.type?.name || 'Indoor' }}
                        </span>
                    </div>
                    
                    <BasePill 
                        :type="court.isActive ? 'success' : 'inactive'" 
                        :text="court.isActive ? 'Activa' : 'Mantenimiento'"
                        :dot="court.isActive"
                    />
                </div>

                <div class="flex-1">
                    <h3 class="text-xl font-black text-slate-900 group-hover:text-[#6B8F3A] transition-colors leading-tight min-h-10">
                        {{ court.name }}
                    </h3>
                </div>

                <div class="flex items-end justify-between border-t border-slate-200 pt-4 mt-auto">
                    <div class="flex flex-col">
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Precio Base</span>
                        <div class="flex items-baseline gap-0.5">
                            <span class="text-2xl font-black text-slate-900">
                                {{ court.basePrice.toFixed(2) }}
                            </span>
                            <span class="text-sm font-bold text-slate-900">€</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-1 bg-slate-50 p-1 rounded-full group-hover:bg-slate-100 transition-colors">
                        <BaseButton 
                            v-for="(btn, index) in actions"
                            v-show="isActionVisible(btn.isVisible, court)"
                            :key="index"
                            :icon="getActionValue(btn.icon, court)" 
                            text 
                            rounded 
                            size="small" 
                            @click="$emit('actionClick', { btn, court, event: $event })"
                            :class="[
                                getActionValue(btn.class, court), 
                                court.isActive && index === 1 ? 'hover:!bg-red-100/70' : 'hover:!bg-white', 
                                'w-8 h-8 !p-0 flex items-center justify-center transition-all'
                            ]"
                        />
                    </div>
                </div>

            </div>
        </template>
    </BaseCard>
</template>



