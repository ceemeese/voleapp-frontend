<script setup lang="ts">
const router = useRouter();
const stepsSectionRef = ref<HTMLElement | null>(null);
    
const scrollToSteps = () => {
    stepsSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const goToAuth = () => {
    router.push({ name: 'login' });
};

</script>

<template>
    
    <section class="w-full bg-white pt-32 sm:pt-40 pb-12 px-6 border-b border-slate-100">
        <div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
            <BasePill text="Para jugadores" type="info" size="normal"/>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight max-w-2xl">
                Encuentra pista libre a tu hora exacta
            </h1>
            <p class="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
                Olvídate de dar vueltas por cuadrantes infinitos o esperar en chats de WhatsApp. Rastreamos la disponibilidad de la ciudad para que solo tengas que llegar y jugar
            </p>
            <div class="pt-2">
                <BaseButton            
                    rounded
                    label='Ver cómo funciona'
                    type="button"
                    icon="pi pi-chevron-down"
                    iconPos="right"
                    class="!px-6 !py-3 !text-slate-600 !bg-slate-100 !font-bold hover:!bg-slate-200 transition-all !border-none"
                    @click="scrollToSteps"
                />
            </div>
        </div>
    </section>


    <section ref="stepsSectionRef" class="w-full bg-slate-50 py-20 px-6 scroll-mt-24">
        <div class="max-w-5xl mx-auto w-full flex flex-col gap-16">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                
                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-16 flex items-center justify-center select-none mb-2">
                        <span class="text-6xl font-black text-[#94C8E7]/60 transition-all duration-300 group-hover:scale-110 leading-none">01</span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Busca tu hora</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Elige cuándo quieres jugar.<br> Nuestro motor localiza cualquier pista disponible de inmediato en tu zona
                    </p>
                </div>

                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-16 flex items-center justify-center select-none mb-2">
                        <span class="text-6xl font-black text-[#C8E794]/70 transition-all duration-300 group-hover:scale-110 leading-none">02</span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Reserva seguro</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Pago 100% inmediato y seguro a través de la app. Recibe tu confirmación directa en el correo
                    </p>
                </div>

                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-16 flex items-center justify-center select-none mb-2">
                        <span class="text-6xl font-black text-purple-200 transition-all duration-300 group-hover:scale-110 leading-none">03</span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">¡A la pista!</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Preséntate en el club con tu grupo sin llamadas previas ni sorpresas de última hora en el mostrador
                    </p>
                </div>
            </div>
        </div>
    </section>

    <section class="w-full bg-white py-16 px-6">
        <div class="max-w-5xl mx-auto">
            <div class="bg-[#EEF7FC] border border-[#94C8E7]/30 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div class="flex-1 space-y-3 text-center md:text-left">
                    <span class="text-xs font-black tracking-widest text-[#3A7FA6] uppercase bg-white px-2.5 py-1 rounded-full border border-[#94C8E7]/40">
                        Ventajas VoleApp
                    </span>
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight mt-2">
                        Precios inteligentes según el clima
                    </h3>
                    <p class="text-sm text-slate-600 max-w-xl leading-relaxed">
                        Aprovecha nuestros <b>precios dinámicos y descuentos directos</b>
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left max-w-md mx-auto md:mx-0">
                        <div class="flex items-center gap-2 text-sm text-slate-700 font-medium whitespace-nowrap">
                            <i class="pi pi-cloud text-[#3A7FA6] font-bold"></i>
                            <span>Descuentos por clima adverso</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-slate-700 font-medium md:whitespace-nowrap">
                            <i class="pi pi-clock text-[#3A7FA6] font-bold"></i>
                            <span>Disponibilidad en tiempo real</span>
                        </div>
                    </div>
                </div>
                <div class="shrink-0 w-full md:w-auto text-center">
                    <BaseButton            
                        rounded
                        label='Encontrar pista'
                        type="button"
                        icon="pi pi-search"
                        iconPos="right"
                        class="!px-8 !py-4 !text-white !bg-[#3A7FA6] !font-bold shadow-md hover:scale-105 transition-all !border-none w-full sm:w-auto"
                        @click="goToAuth"
                    />
                </div>
            </div>
        </div>
    </section>
</template>