<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toast } from 'primevue';
import ConfirmPopup from 'primevue/confirmpopup';
import { apiErrorBus } from '@/composables/useApiBus';

const toast = useToast();

onMounted(() => {
    apiErrorBus.on((message) => {
        toast.add({ 
            severity: 'error', 
            summary: 'Error del servidor', 
            detail: message, 
            life: 2000 
        });
    });
});

</script>

<template>
    <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.path"></component>
    </router-view>
    <Toast />
    <ConfirmPopup />
</template>


<style>

@media (max-width: 640px) {
    .p-toast {
        width: 90vw !important;
        left: 5vw !important; 
    }

    .p-toast-message-content {
        padding: 0.75rem !important;
    }

    .p-toast-summary {
        font-size: 0.9rem !important;
    }

    .p-toast-detail {
        font-size: 0.8rem !important;
    }
}
</style>