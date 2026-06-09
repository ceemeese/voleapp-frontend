<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { animate, createTimeline, stagger } from 'animejs';

const router = useRouter();
const ballRef = ref(null);
const textRef = ref<HTMLElement | null>(null);
const stepsSectionRef = ref<HTMLElement | null>(null);
    
const scrollToSteps = () => {
    stepsSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
    if (!textRef.value || !ballRef.value) return;
    const spans = textRef.value.querySelectorAll('span');
    createTimeline().add(spans, {
        translateX: [-150, 0],
        opacity: [0, 1],
        delay: stagger(500),
        duration: 1500,
        easing: 'out-quartic'
    })
        
    animate(ballRef.value, {
        y: '-3rem',
        loop: true,
        alternate: true,
        frameRate: 60,
    });
});

const goToAuth = () => {
    router.push({ name: RouteNames.REGISTER });
};
</script>


  <template>
    <section class="relative w-full min-h-svh overflow-hidden bg-[#94C8E7] flex flex-col">
        
        <div class="max-w-7xl mx-auto w-full flex-1 px-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-15 sm:gap-10">
        
            <div ref="textRef" class="z-10">
                <h1 class="text-[70px] sm:text-[100px] xl:text-[130px] leading-[0.85] font-black text-white uppercase tracking-tighter">
                    <span class="block">RETA</span>
                    <span class="block">RESERVA</span>
                    <span class="block">REPITE</span>
                </h1>
            </div>


            <div ref="ballRef" class="w-[60%] md:w-1/2 flex justify-center items-center pointer-events-none">
                <img 
                    src="/src/assets/ball-removebg.png"
                    alt="Pelota de pádel" 
                    class="w-full h-auto max-w-[150px] md:max-w-[350px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.2)]"
                />
            </div>
        </div>

        <div class="absolute bottom-12 left-1/2 -translate-x-1/2">
            <BaseButton            
                rounded
                label='Descubre cómo funciona'
                type="button"
                icon="pi pi-chevron-right"
                iconPos="right"
                class="!px-8 !py-4 bottom-12 !text-gray-500 !bg-white/40 !backdrop-blur-md !border !border-white/40 !font-bold shadow-lg hover:!bg-white/50 transition-all hover:!text-black"
                @click="scrollToSteps"
            />
        </div>
    </section>


    <section ref="stepsSectionRef" class="w-full bg-slate-50 py-24 px-6 border-t border-slate-100">
        <div class="max-w-7xl mx-auto w-full flex flex-col gap-12">
            
            <div class="text-center">
                <BasePill text="Paso a paso" type="success" size="normal"/>
                <h2 class="text-3xl sm:text-4xl font-black text-slate-800 mt-4 tracking-tight">
                    Dominar la pista nunca fue tan fácil
                </h2>
                <p class="text-slate-500 mt-2 max-w-5xl mx-auto">
                    Olvídate de llamadas infinitas y grupos de WhatsApp caóticos. Reserva en tres clics
                </p>
            </div>


            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 max-w-5xl mx-auto w-full">
        
                <div class="flex flex-col items-center text-center group px-4">
                    
                    <div class="w-24 h-20 flex items-center justify-center select-none mb-2">
                        <span class="text-7xl font-black text-[#94C8E7]/70 transition-all duration-300 group-hover:scale-110 leading-none">
                            01
                        </span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Encuentra tu club</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Filtra por fecha, hora, ciudad y duración. El sitio perfecto para tu nivel
                    </p>
                </div>

                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-20 flex items-center justify-center select-none mb-2">
                        <span class="text-7xl font-black text-[#C8E794]/70 transition-all duration-300 group-hover:scale-110 leading-none">
                            02
                        </span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">Reserva y asegura</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Pago 100% seguro de forma instantánea. Confirmación en tu correo sin sorpresas
                    </p>
                </div>

                <div class="flex flex-col items-center text-center group px-4">
                    <div class="w-24 h-20 flex items-center justify-center select-none mb-2">
                        <span class="text-7xl font-black text-purple-200 transition-all duration-300 group-hover:scale-110 leading-none">
                            03
                        </span>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">¡A jugar!</h4>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Reúne a tu grupo, saltad a la pista y disfrutad
                    </p>
                </div>

            </div>
        </div>
    </section>


    <section class="w-full bg-white py-20 px-6">
            <div class="max-w-7xl mx-auto">
                
                <div class="bg-[#94C8E7] border border-[#94C8E7]/40 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                    
                    <div class="flex-1 space-y-4 text-center md:text-left">
                        <span class="text-xs font-black tracking-widest text-[#3A7FA6] uppercase bg-white px-2.5 py-1 rounded-full border border-[#94C8E7]/40">
                            Ventajas VoleApp
                        </span>
                        <h3 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-3">
                            Juega más, paga menos
                        </h3>
                        <p class="text-sm sm:text-base text-slate-700 max-w-xl leading-relaxed">
                            Aprovecha los <b>precios dinámicos y descuentos exclusivos</b>
                        </p>
                        
                        
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-left max-w-md md:max-w-xl mx-auto md:mx-0">
                            <div class="flex items-center gap-2 text-sm text-slate-700 font-medium whitespace-nowrap">
                                <i class="pi pi-cloud text-[#3A7FA6] font-bold"></i>
                                <span>Descuentos por clima adverso</span>
                            </div>

                            <div class="flex items-center gap-2 text-sm text-slate-700 font-medium md:whitespace-nowrap">
                                <i class="pi pi-clock text-[#3A7FA6] font-bold"></i>
                                <span>Disponibilidad inmediata a tu hora</span>
                            </div>
                        </div>
                    </div>

                    <div class="shrink-0 w-full md:w-auto text-center">
                        <BaseButton            
                            rounded
                            label='Empezar a ahorrar'
                            type="button"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            class="!px-8 !py-4 !text-gray-500 !bg-white/40 !backdrop-blur-md !border !border-white/40 !font-bold shadow-lg hover:!bg-white/50 transition-all hover:!text-black"
                            @click="goToAuth"
                        />
                    </div>

                </div>
            </div>
    </section>
</template>


<style scoped>
</style>
