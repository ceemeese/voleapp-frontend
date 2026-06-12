<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';

const route = useRoute();
defineProps<{image?: string}>();

</script>

<template>
    <div class="bg-gray-100 flex justify-center items-center h-dvh overflow-hidden">

        <div class="w-1/2 h-full hidden xl:block">
            <img :src="route.meta.authImage as string" class="w-full h-full object-cover" />
        </div>

        <div class="w-full xl:w-1/2 h-full flex flex-col items-center justify-center p-8">
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
