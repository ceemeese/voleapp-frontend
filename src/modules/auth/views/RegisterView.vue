<script setup lang="ts">
import { RouteNames } from '@/router/routeNames';
import type { RegisterValues } from 'ui';

const toast = useToast();
const router = useRouter();
const { register, isLoading} = useAuth();

const onRegisterSubmit = async (formData: RegisterValues) => {
  try {
    await register(formData);
    toast.add({
      severity: 'success',
      summary: '¡Bienvenido!', 
      detail: 'Registro realizado', 
      life: 3000
    })

    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push({ name: RouteNames.LOGIN });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error';

    toast.add({ 
      severity: 'error', 
      summary: 'Error de registro', 
      detail: message, 
      life: 5000 
    });
  }
};
</script>


<template>

  <div class="flex items-center">
    <div class="w-full max-w-md">

      <RegisterForm 
        :loading="isLoading"
        @submit="onRegisterSubmit"
      />
      
    </div>
  </div>

</template>

<style scoped>

</style>