<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toast } from 'primevue';
import ConfirmPopup from 'primevue/confirmpopup';
</script>

<template>
  <RouterView />
  <Toast />
  <ConfirmPopup />
</template>

<style scoped>

</style>
