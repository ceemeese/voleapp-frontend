<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted, ref } from 'vue';
import { Footer, HeaderM, type NavItem } from 'ui';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/router/routeNames';

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
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 3000 });
    } finally {
        isInitialLoading.value = false;
    }
});

const headerLinks = computed<NavItem[]>(() => {
    if (isUserLogged.value) {
        return [
            { title: 'Inicio', to: { name: RouteNames.HOME }, icon: 'pi pi-home' },
            { title: 'Reservar', to: { name: RouteNames.BOOKING }, icon: 'pi pi-calendar' },
            { title: 'Perfil', to: { name: RouteNames.USER_PROFILE }, icon: 'pi pi-user' },
        ];
    }
    return [
        { title: 'Inicio', to: { name: RouteNames.HOME }, icon: 'pi pi-home' },
        { title: 'Usuarios', to: { name: RouteNames.PUBLIC_USERS }, icon: 'pi pi-users' },
        { title: 'Clubs', to: { name: RouteNames.PUBLIC_CLUBS }, icon: 'pi pi-shop' },
    ];
});

const footerLinks = computed<NavItem[]>(() => {
    if (isUserLogged.value) {
        return [
            { title: 'Inicio', to: { name: RouteNames.USER_HOME } },
            { title: 'Perfil', to: { name: RouteNames.USER_PROFILE } },
            { title: 'Reservar', to: { name: RouteNames.BOOKING } },
            { title: 'Contacto', to: { name: RouteNames.PUBLIC_CONTACT } },
        ];
    }
    return [
        { title: 'Sobre Nosotros', to: { name: RouteNames.PUBLIC_ABOUT } },
        { title: 'Contacto', to: { name: RouteNames.PUBLIC_CONTACT } },
    ];
});

const goToLogin = () => {
    router.push({ name: RouteNames.LOGIN });
}
const goToProfile = () => {
    router.push({ name: RouteNames.USER_PROFILE });
}

const handleLogout = () => {
    authStore.logout();
    router.push( {name: RouteNames.HOME });
}

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <HeaderM 
            :navigation-items="headerLinks" 
            class="header-shrink" :is-authenticated="isUserLogged" 
            @login="goToLogin" 
            @profile="goToProfile" 
            @logout="handleLogout"
            :home-route-name="isUserLogged ? RouteNames.USER_HOME : RouteNames.HOME" >
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