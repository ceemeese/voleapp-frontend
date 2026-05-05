<script setup lang="ts">
import { animate, createTimeline, stagger } from 'animejs';
import { BaseButton } from 'ui';
import { ref, onMounted } from 'vue';

const ballRef = ref(null);
const textRef = ref<HTMLElement | null>(null);

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
</script>


  <template>
  <div class="relative w-full min-h-svh overflow-hidden bg-[#94C8E7] flex flex-col">
    
    <div class="max-w-7xl mx-auto w-full flex-1 px-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-15 sm:gap-10">
      
        <div ref="textRef" class="z-10 f">
            <h1 class="text-[70px] sm:text-[100px] lg:text-[130px] leading-[0.85] font-black text-white uppercase tracking-tighter">
                <span class="block">RETA</span>
                <span class="block">RESERVA</span>
                <span class="block">REPITE</span>
            </h1>
            <!--<p class="text-md sm:text-xl font-bold text-[#344533] max-w-md mx-auto md:mx-0">
                No pierdas el punto de oro.<br> 
                Reserva tu pista antes que nadie en VoleApp
            </p>-->
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
            class="bottom-12 !text-gray-500 !bg-white/40 !backdrop-blur-md !border !border-white/40 !font-bold shadow-lg hover:!bg-white/50 transition-all hover:!text-black"
        >
        </BaseButton>
    </div>
  </div>
</template>


<style scoped>
</style>
