<script setup lang="ts">
import { ref } from 'vue';
import { Tag } from 'primevue';
import { BaseButton, BaseCard } from 'ui';
import { useRouter } from 'vue-router';

const router = useRouter();
const stepsSectionRef = ref<HTMLElement | null>(null);
    
const scrollToSteps = () => {
    stepsSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const goToContact = () => {
    router.push({ name: 'contact' });
};
</script>

<template>

    <section class="w-full bg-white pt-32 sm:pt-40 pb-12 px-6 border-b border-slate-100">
        <div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
            <Tag class="text-xs font-black tracking-widest !text-[#6B8F3A] uppercase !bg-[#F3FAEA] px-3 py-1.5 !rounded-full border !border-[#C8E794]/40">
                Para Centros Deportivos
            </Tag>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight max-w-2xl">
                Automatiza tus reservas y llena tus pistas
            </h1>
            <p class="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
                Moderniza tu club con un calendario digital propio y recibe reservas automáticas las 24 horas del día. Optimiza tu ocupación en tiempo real y sin esfuerzo manual.
            </p>
            <div class="pt-2">
                <BaseButton            
                    rounded
                    label='Ver beneficios'
                    type="button"
                    icon="pi pi-chevron-down"
                    iconPos="right"
                    class="!px-6 !py-3 !text-slate-600 !bg-slate-100 !font-bold hover:!bg-slate-200 transition-all !border-none"
                    @click="scrollToSteps"
                />
            </div>
        </div>
    </section>


    <section ref="stepsSectionRef" class="w-full bg-slate-50 py-20 px-6">
        <div class="max-w-5xl mx-auto w-full flex flex-col gap-16">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
  
                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-16 flex items-center justify-center select-none mb-2">
                        <span class="text-6xl font-black text-slate-200 transition-all duration-300 group-hover:text-slate-300 leading-none">01</span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Ocupación Continua</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Tus cuadrantes visibles en tiempo real para miles de deportistas locales, multiplicando tus reservas diarias de forma orgánica
                    </p>
                </div>

                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-16 flex items-center justify-center select-none mb-2">
                        <span class="text-6xl font-black text-[#C8E794]/70 transition-all duration-300 group-hover:scale-110 leading-none">02</span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Tarifas del Clima</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Incentiva las horas más difíciles vinculando pequeños descuentos automáticos si el clima adverso frena la demanda habitual
                    </p>
                </div>

                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-16 flex items-center justify-center select-none mb-2">
                        <span class="text-6xl font-black text-[#94C8E7]/60 transition-all duration-300 group-hover:scale-110 leading-none">03</span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Ingresos Asegurados</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Se acabaron las reservas fantasma que te dejan colgado. El pago integrado garantiza el cobro de tu pista por adelantado
                    </p>
                </div>
            </div>
        </div>
    </section>


    <section class="w-full bg-white py-20 px-6 border-t border-slate-100">
        <div class="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
            
            <div class="flex-1 space-y-4 text-center md:text-left">
                <span class="text-xs font-black tracking-widest text-[#6B8F3A] uppercase bg-[#F3FAEA] px-2.5 py-1 rounded-full border border-[#C8E794]/40">
                    Panel de Control
                </span>
                <h3 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-3">
                    Toma el control con KPIs claros y reales
                </h3>
                <p class="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
                    Lo que no se mide, no se puede mejorar. VoleApp te ofrece un panel intuitivo con los indicadores clave de tu negocio para que entiendas la ocupación de tus pistas minuto a minuto
                </p>
            </div>

            <div class="flex-1 w-full grid grid-cols-2 gap-4 max-w-md mx-auto">
                
                <div class="p-6 bg-[#EEF7FC] border border-[#94C8E7]/30 rounded-2xl flex flex-col items-center text-center">
                    <div class="text-2xl font-black text-[#3A7FA6] tracking-tight">1,250</div>
                    <div class="text-xs font-bold text-[#3A7FA6]/70 uppercase tracking-wider mt-1">Reservas Totales</div>
                </div>

                <div class="p-6 bg-[#F3FAEA] border border-[#C8E794]/30 rounded-2xl flex flex-col items-center text-center">
                    <div class="text-2xl font-black text-[#6B8F3A] tracking-tight">€14.2K</div>
                    <div class="text-xs font-bold text-[#6B8F3A]/70 uppercase tracking-wider mt-1">Total Ingresos</div>
                </div>

                <div class="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center text-center">
                    <div class="text-2xl font-black text-slate-900 tracking-tight">Mensual</div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Filtro y Evolución</div>
                </div>

                <div class="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center text-center">
                    <div class="text-2xl font-black text-slate-900 tracking-tight">24</div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Reservas Canceladas</div>
                </div>

            </div>

        </div>
    </section>


    <section class="w-full bg-white pb-16 px-6">
        <div class="max-w-5xl mx-auto">
            <BaseCard class="!bg-slate-900 !border !border-slate-800 !rounded-2xl !p-8 sm:!p-10 !flex !flex-col md:!flex-row !items-center !justify-between !gap-8 !shadow-lg">
                <div class="flex-1 space-y-2 text-center md:text-left">
                    <span class="text-xs font-black tracking-widest text-[#C8E794] uppercase bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                        Alta de Centros
                    </span>
                    <h3 class="text-2xl font-black text-white tracking-tight mt-2">
                        ¿Quieres rentabilizar tus espacios libres?
                    </h3>
                    <p class="text-sm text-slate-300 max-w-xl leading-relaxed">
                        Únete hoy mismo a la red de VoleApp y delega el control comercial de tus pistas en nuestro gestor digital automático
                    </p>
                </div>
                <div class="shrink-0 w-full md:w-auto text-center">
                    <BaseButton            
                        rounded
                        label='Dar de alta mi club'
                        type="button"
                        icon="pi pi-shop"
                        iconPos="right"
                        class="!px-8 !py-4 !text-slate-900 !bg-[#C8E794] !font-bold !shadow-md hover:scale-105 !transition-all !border-none w-full sm:!w-auto"
                        @click="goToContact"
                    />
                </div>
            </BaseCard>
        </div>
    </section>
</template>