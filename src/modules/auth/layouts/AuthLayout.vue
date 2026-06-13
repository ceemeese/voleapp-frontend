<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';

const route = useRoute();

const isLoaded = ref(false);

const onImageLoad = () => {
  isLoaded.value = true;
};

const images = import.meta.glob('@/assets/*.{jpg,jpeg}', { query: '?url', eager: true, import: 'default'});

const currentImage = computed(() => getImageUrl(route.meta.authImage as string))
const blurImage = computed(() => getImageUrl(route.meta.blurImage as string))

const getImageUrl = (url:string) => {
    const imageModule = images[url] as string;
    return imageModule ? imageModule : '';
}

</script>

<template>
    <div class="bg-gray-100 flex justify-center items-center h-dvh overflow-hidden">
        <div class="w-1/2 h-full hidden xl:block relative overflow-hidden"> 
            <div 
                class="absolute inset-0 z-0 bg-cover bg-center blur-lg scale-110"
                :style="{ backgroundImage: `url(${blurImage})` }"
                >
            </div>

            <img 
            :src="currentImage" 
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            :class="isLoaded ? 'opacity-100' : 'opacity-0'"
            @load="onImageLoad"
            />
        </div>

        <div class="z-20 w-full xl:w-1/2 h-full flex flex-col items-center justify-center p-8">
            <div class="mb-8 flex flex-col items-center">
                <router-link
                :to="{name: RouteNames.HOME}"
                class="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                >
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-20 w-auto" 
                />
                </router-link>
                <p class="text-gray-500 text-sm font-medium">Gestión Deportiva Inteligente</p>
            </div>
            <div class="w-full max-w-md">
                <RouterView />
            </div>
        </div>
  </div>
</template>
