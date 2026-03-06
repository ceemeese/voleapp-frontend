<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const { login, isLoading} = useAuth();

const errorMessage = ref('');

const onLoginSubmit = async (formData: any) => {
  errorMessage.value = '';
  try {
    await login(formData);
    toast.add({
      severity: 'success',
      summary: '¡Bienvenido!', 
      detail: 'Has iniciado sesión correctamente', 
      life: 3000
    })
    router.push({ name: 'home' });
  } catch (error: any) {
    errorMessage.value = error.message || 'Error inesperado';
    toast.add({ 
      severity: 'error', 
      summary: 'Error de acceso', 
      detail: errorMessage.value, 
      life: 5000 
    });
    console.log('Error', error);
  }
};
</script>


<template>

  <div class="flex items-center">
    <div class="w-full max-w-md">

      <LoginForm 
        :loading="isLoading"
        @submit="onLoginSubmit"
      />
      
    </div>
  </div>

<Toast />
</template>

<style scoped>

</style>