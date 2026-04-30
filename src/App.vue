<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toast } from 'primevue';
import ConfirmPopup from 'primevue/confirmpopup';
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <Toast />
  <ConfirmPopup />
</template>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
