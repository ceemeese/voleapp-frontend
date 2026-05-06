<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted, ref } from 'vue';
import { Footer, HeaderM, type NavItem } from 'ui';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();
const isInitialLoading = ref(false);

const isUserLogged = computed(() => authStore.isAuthenticated && !authStore.isAdmin);

onMounted(async () => {
    if (!isUserLogged.value) return;
    
    isInitialLoading.value = true;
    try {
        await userStore.fetchProfile();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ 
            severity: 'error', 
            summary: 'Error de acceso', 
            detail: message,
            life: 5000 
        });
    } finally {
        isInitialLoading.value = false;
    }
});

const headerLinks = computed<NavItem[]>(() => {
    if (isUserLogged.value) {
        return [
            { title: 'Inicio', to: { name: 'user-home' }, icon: 'pi pi-home' },
            { title: 'Reservar', to: { name: 'booking' }, icon: 'pi pi-calendar' },
            { title: 'Perfil', to: { name: 'user-profile' }, icon: 'pi pi-user' },
        ];
    }
    return [
        { title: 'Inicio', to: { name: 'home' }, icon: 'pi pi-home' },
        { title: 'Usuarios', to: { name: 'login' }, icon: 'pi pi-users' },
        { title: 'Clubs', to: { name: 'login' }, icon: 'pi pi-shop' },
    ];
});

const footerLinks = computed<NavItem[]>(() => {
    if (isUserLogged.value) {
        return [
            { title: 'Soporte', to: { name: 'user-home' } },
            { title: 'Términos', to: { name: 'user-home' } },
            { title: 'Privacidad', to: { name: 'user-profile' } },
        ];
    }
    return [
        { title: 'Sobre Nosotros', to: { name: 'home' } },
        { title: 'Tarifas', to: { name: 'home' } },
        { title: 'Contacto', to: { name: 'home' } },
    ];
});

const goToLogin = () => {
    router.push({ name: 'login'});
}
const goToProfile = () => {
    router.push({ name: 'profile'});
}

const handleLogout = () => {
    authStore.logout();
    router.push( {name: 'home'});
}

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <HeaderM :navigation-items="headerLinks" class="header-shrink" :is-authenticated="isUserLogged" @login="goToLogin" @profile="goToProfile" @logout="handleLogout">
            <template #logo>
                <img src="/src/assets/voleappblack.png" alt="VoleApp Logo" class="h-10 sm:h-15 w-auto" />
            </template>
        </HeaderM>

        <main class="flex-1 w-full h-full mx-auto flex flex-col items-center" :class="isUserLogged ? 'mt-20 sm:mt-35 max-w-7xl' : ''">
            <div v-if="isInitialLoading" class="flex items-center justify-center h-full">
                <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
            </div>
            <RouterView v-else />
        </main>

        <Footer :navigation-items="footerLinks" title-logo="VoleApp">
            <template #logo>
                <img src="/src/assets/voleappblack.png" alt="VoleApp Logo" class="h-10 w-auto mb-2" />
            </template>
        </Footer>
    </div>
</template>