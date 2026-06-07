<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import type { AppNavigationGroup } from '@/types/navigation.interface';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useClub } from '@/composables/useClub';
import { NavUserCard, Navbar } from 'ui';

const { getAdminContext, currentClubInfo } = useClub();
const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();
const router = useRouter();
const errorMessage = ref<string>('');
const isInitialLoading = ref(true);

onMounted(async () => {
    try {
        await userStore.fetchProfile()
        
        if (authStore.role === 'Admin'){
            await getAdminContext();
        }
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        errorMessage.value = message;
        toast.add({ 
            severity: 'error', 
            summary: 'Error de acceso', 
            detail: errorMessage.value,
            life: 5000 
        });
    } finally {
        isInitialLoading.value = false;
    }
})


const CLUB_ADMIN_MENU : AppNavigationGroup[] = [
    {
        label: 'Análisis y rendimiento',
        items: [
            { label: 'Dashboard', to: {name: 'admin-dashboard'}, icon: 'pi pi-chart-bar'},
            { label: 'Análisis', to: {name: 'admin-analytics'}, icon: 'pi pi-chart-line'},
            { label: 'Ocupación de pistas', to: {name: 'admin-occupancy'}, icon: 'pi pi-percentage'},
        ]
    },
    {
        label: 'Gestión operativa',
        items: [
            { label: 'Gestión de pistas', to: {name: 'admin-courts'}, icon: 'pi pi-table'},
            { label: 'Calendario de eventos', to: {name: 'admin-events'}, icon: 'pi pi-calendar'},
            { label: 'Reservas', to: {name: 'admin-reservations'}, icon: 'pi pi-ticket'},
            { label: 'Configurador de precios', to: {name: 'admin-price'}, icon: 'pi pi-money-bill'},
        ]
    },
     {
        label: 'Gestión de accesos',
        items: [
            { label: 'Miembros del club', to: {name: 'admin-members'}, icon: 'pi pi-users'},
        ]
    },
    {
        label: 'Configuración',
        items: [
            { label: 'Mi club', to: {name: 'admin-club'}, icon: 'pi pi-home'},
            { label: 'Mi perfil', to: {name: 'admin-profile'}, icon: 'pi pi-user'},
        ]
    }
];

const SUPER_ADMIN_MENU: AppNavigationGroup[] = [
    {
        label: 'Control Global',
        items: [
            { label: 'Global Dashboard', to: { name: 'management-dashboard' }, icon: 'pi pi-globe' },
            { label: 'Análisis', to: {name: 'management-analytics'}, icon: 'pi pi-chart-line'},
            { label: 'Ocupación', to: {name: 'management-occupancy'}, icon: 'pi pi-percentage'},
            { label: 'Clubs', to: { name: 'admin-clubs' }, icon: 'pi pi-shop' },
            { label: 'Usuarios', to: { name: 'admin-users' }, icon: 'pi pi-users' },
        ]
    },
        {
        label: 'Configuración',
        items: [
            { label: 'Mi perfil', to: {name: 'admin-profile'}, icon: 'pi pi-user'},
        ]
    }
];

const currentMenu = computed<AppNavigationGroup[]>(() => {
    if (authStore.role === 'SuperAdmin'){
        return SUPER_ADMIN_MENU;
    }
    return CLUB_ADMIN_MENU;
})

const headerTitle = computed(() => {
    if (authStore.role === 'SuperAdmin'){
        return 'VoleApp Global Admin';
    }
    return `${currentClubInfo.value?.name || 'Club'}  Admin`
})


const handleLogout = async () => {
    toast.add({ 
            severity: 'success', 
            summary: 'Logout', 
            detail: 'Cerrando sesión de usuario',
            life: 2000 
        });
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    authStore.logout();
    userStore.clearProfile();
    router.push( {name: 'login'});
}

</script>

<template>
    <div class="h-screen flex overflow-hidden bg-gray-50 p-6 gap-6">

        <Navbar
            :navigation-items="currentMenu"
        >
            <template #logo>
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-15 mb-2" 
                />
            </template>
        </Navbar>

        <main class="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            <header class="flex justify-between items-center p-4">
                <div class="flex items-center gap-2">
                   <slot name="header-actions">
                        <span class="text-sm font-bold text-gray-700 uppercase tracking-widest">
                            {{ headerTitle}}
                        </span>
                    </slot>
                </div>

                <div class="w-fit min-w-60">
                    <NavUserCard
                    :username="userStore.profile?.username ?? 'Cargando..'"
                    :user-role="authStore.role ?? 'Admin'"
                    nagivate-to="admin-profile"
                    @logout="handleLogout"
                    >
                    </NavUserCard>
                </div>
            </header>

            <div v-if="isInitialLoading" class="flex items-center justify-center h-full">
                <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
            </div>
            <router-view v-else v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" :key="$route.path">
                        <template #header-actions>
                            <slot name="header-actions" />
                        </template>
                    </component>
                </keep-alive>
            </router-view>
        </main>

    </div>
</template>