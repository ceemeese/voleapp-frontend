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
const isInitialLoading = ref<boolean>(false);
const isMobileMenuVisible = ref<boolean>(false);
const isMobile = ref(window.innerWidth < 768);
const loginLabel = computed(() => isMobile.value ? '' : 'Log in');
const { isLoading } = useGlobalLoading();
const isLoadingLayout = ref<boolean>(false);

const isScreenBlocked = computed(() => isLoading.value || isLoadingLayout.value);
const isUserLogged = computed(() => authStore.isAuthenticated && !authStore.isAdmin);

onMounted(async () => {
    if (!isUserLogged.value) return;
    
    isInitialLoading.value = true;
    try {
        await userStore.fetchProfile();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
    } finally {
        isInitialLoading.value = false;
    }
});

const headerLinks = computed<NavItem[]>(() => {
    if (isUserLogged.value) {
        return [
            { title: 'Inicio', to: { name: RouteNames.USER_HOME }, icon: 'pi pi-home' },
            { title: 'Reservar', to: { name: RouteNames.BOOKING }, icon: 'pi pi-calendar' },
            { title: 'Perfil', to: { name: RouteNames.USER_PROFILE }, icon: 'pi pi-user' },
        ];
    }
    return [
        { title: 'Inicio', to: { name: RouteNames.HOME }, icon: 'pi pi-home' },
        { title: 'Usuarios', to: { name: RouteNames.PUBLIC_USERS }, icon: 'pi pi-users' },
        { title: 'Clubs', to: { name: RouteNames.PUBLIC_CLUBS }, icon: 'pi pi-shop' },
        { title: 'Sobre Nosotros', to: { name: RouteNames.PUBLIC_ABOUT }, icon: 'pi pi-users' },
        { title: 'Contacto', to: { name: RouteNames.PUBLIC_CONTACT }, icon: 'pi pi-envelope' },
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

const handleLogout = async() => {
    isLoadingLayout.value = true;
    toast.add({ severity: 'success', summary: 'Logout', detail: 'Cerrando sesión de usuario',life: 1000 });
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    isLoadingLayout.value = false;
    authStore.logout();
    router.push( {name: RouteNames.HOME});
}

const handleMobileMenuVisible = (() => {
    isMobileMenuVisible.value = true;
})

</script>

<template>
    <BlockUI 
        v-if="isScreenBlocked" 
        :fullScreen="true" 
        :autoZIndex="true" 
        :baseZIndex="9999"
    />
    
    <div class="min-h-screen flex flex-col">

        <HeaderM 
            :navigation-items="headerLinks" 
            class="header-shrink" :is-authenticated="isUserLogged" 
            @login="goToLogin" 
            :login-label="loginLabel"
            @profile="goToProfile" 
            @logout="handleLogout"
            @toggle-mobile-menu="handleMobileMenuVisible"
            :home-route-name="isUserLogged ? RouteNames.USER_HOME : RouteNames.HOME" >
            <template #logo>
                <img src="/src/assets/voleappblack.png" alt="VoleApp Logo" class="h-8 sm:h-15 w-auto" />
            </template>
        </HeaderM>

        <Drawer v-model:visible="isMobileMenuVisible" header="Menú" position="left" class="w-full md:w-80">
            <nav class="flex flex-col gap-4 mt-6">
                <RouterLink 
                    v-for="link in headerLinks" 
                    :key="link.title"
                    :to="link.to" 
                    @click="isMobileMenuVisible = false"
                    class="flex items-center gap-3 p-4 border-b hover:bg-slate-50 transition-colors"
                >
                    <i :class="link.icon"></i>
                    <span class="text-lg font-medium">{{ link.title }}</span>
                </RouterLink>
            </nav>
        </Drawer>

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