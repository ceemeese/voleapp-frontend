<script setup lang="ts">
import { ref } from 'vue';
import { Tag } from 'primevue';
import { BaseButton } from 'ui';
import { useRouter } from 'vue-router';
import Timeline from 'primevue/timeline';


const router = useRouter();
const contentSectionRef = ref<HTMLElement | null>(null);
    
const scrollToContent = () => {
    contentSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const goToContact = () => {
    router.push({ name: 'contact' });
};

const phases = ref([
    {
        sub: 'Fase 01',
        title: 'Centralización del Calendario',
        description: 'Sustituimos el papel y los cuadrantes obsoletos por un calendario digital propio y centralizado. El club gestiona la disponibilidad de todas sus pistas directamente desde nuestro tablero en tiempo real.'
    },
    {
        sub: 'Fase 02',
        title: 'Automatización de Cobros',
        description: 'Desarrollamos un flujo donde el usuario liquida la reserva al instante. Esto elimina fricciones en recepción, llamadas fuera de hora y pérdidas económicas por pistas reservadas que se quedan vacías.'
    },
    {
        sub: 'Fase 03',
        title: 'Optimización del Tablero',
        description: 'Dotamos al administrador de herramientas analíticas para balancear la carga de juego, permitiendo aplicar configuraciones específicas en sus tarifas para dinamizar las horas de menor afluencia.'
    }
]);
</script>

<template>
    
    <section class="w-full bg-white pt-32 sm:pt-40 pb-12 px-6 border-b border-slate-100">
        <div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
            <Tag class="text-xs font-black tracking-widest !text-[#3A7FA6] uppercase !bg-[#EEF7FC] px-3 py-1.5 !rounded-full border !border-[#94C8E7]/40">
                Nosotros
            </Tag>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight max-w-2xl">
                Pasión por el deporte, obsesión por la eficiencia
            </h1>
            <p class="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
                Nacimos con un objetivo claro: eliminar la fricción al reservar pistas y conectar a la comunidad de la forma más rápida y transparente posible
            </p>
            <div class="pt-2">
                <BaseButton            
                    rounded
                    label='Conócenos más'
                    type="button"
                    icon="pi pi-chevron-down"
                    iconPos="right"
                    class="!px-6 !py-3 !text-slate-600 !bg-slate-100 !font-bold hover:!bg-slate-200 transition-all !border-none"
                    @click="scrollToContent"
                />
            </div>
        </div>
    </section>


   <section ref="contentSectionRef" class="w-full bg-slate-50 py-24 px-6 scroll-mt-24">
        <div class="max-w-3xl mx-auto w-full">
            
            <Timeline 
                :value="phases" 
                align="left" 
                :pt="{
                    eventOpposite: { class: '!hidden'},
                    eventContent: { class: 'pb-12' },
                    eventConnector: { class: 'last:!block min-h-[60px]' }
                }"
            >
                
                <template #marker="slotProps">
                    <div 
                        v-if="!slotProps.item.isEndSpacer"
                        class="w-4 h-4 rounded-full bg-slate-900 border-4 border-slate-50 ring-4 ring-slate-200 z-10"
                    ></div>
                    <div v-else class="w-4 h-4 bg-transparent z-10"></div>
                </template>

                <template #content="slotProps">
                    <div class="pl-4 sm:pl-8 -top-2 relative pb-10">
                        <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                            <span class="text-xs font-black tracking-widest text-slate-400 uppercase font-mono">
                                {{ slotProps.item.sub }}
                            </span>
                            <h4 class="text-xl font-black text-slate-950 tracking-tight">
                                {{ slotProps.item.title }}
                            </h4>
                        </div>
                        <p class="text-sm text-slate-500 leading-relaxed max-w-2xl mt-2">
                            {{ slotProps.item.description }}
                        </p>
                    </div>
                </template>
            </Timeline>

        </div>
    </section>

    
    <section class="w-full bg-white py-16 px-6">
        <div class="max-w-4xl mx-auto text-center space-y-6">
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Haciendo el deporte más accesible, pista a pista
            </h3>
            <p class="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
                VoleApp es el resultado de un equipo apasionado por el deporte que se cansó de los procesos manuales y los teléfonos comunicando. Seguimos evolucionando nuestra plataforma para ofrecer el mejor gestor deportivo del mercado
            </p>
            <div class="pt-4">
                <BaseButton            
                    rounded
                    label='¿Tienes dudas? Contáctanos'
                    type="button"
                    icon="pi pi-envelope"
                    iconPos="right"
                    class="!px-6 !py-3 !text-white !bg-[#3A7FA6] !font-bold shadow-md hover:scale-105 transition-all !border-none"
                    @click="goToContact"
                />
            </div>
        </div>
    </section>
</template>