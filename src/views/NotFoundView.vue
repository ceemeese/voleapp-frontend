<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const handleGoBack = () => {

  if (!authStore.isAuthenticated) {
    router.push({ name: RouteNames.LOGIN });
    return;
  }

  if (authStore.isAdmin) {
    router.push({ name: RouteNames.ADMIN_ROOT });
  } else {
    router.push({ name: RouteNames.USER_HOME });
  }
};

</script>

<template>
  <div class="ui:flex ui:flex-col ui:items-center ui:justify-center ui:h-screen ui:text-center ui:p-6">
    <h1 class="ui:text-6xl ui:font-black ui:text-gray-900">404</h1>
    <h2 class="ui:text-2xl ui:font-bold ui:text-gray-700 ui:mt-4">Página no encontrada</h2>
    <p class="ui:text-gray-500 ui:mt-2 ui:mb-8">Parece que la ruta que buscas no existe o ha sido movida</p>
    
    <BaseButton 
      label="Volver al inicio" 
      @click="handleGoBack" 
      class="ui:w-48"
    />
  </div>
</template>