<script setup lang="ts">
import type { AppNavigationGroup } from '@/types/navigation.interface';
import { RouteNames } from '@/router/routeNames';
import { NavbarMobile } from 'ui';

const { getAdminContext, currentClubInfo } = useClub();
const authStore = useAuthStore();
const userStore = useUserStore();
const clubStore = useClubStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const isInitialLoading = ref<boolean>(true);
const showMobileMenu = ref<boolean>(false);

onMounted(async () => {
    try {
        await userStore.fetchProfile()
        
        if (authStore.role === 'Admin'){
            await getAdminContext();
        }
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error de acceso', detail: message,life: 3000 });
    } finally {
        isInitialLoading.value = false;
    }
})


const CLUB_ADMIN_MENU : AppNavigationGroup[] = [
    {
        label: 'Análisis y rendimiento',
        items: [
            { label: 'Dashboard', to: { name: RouteNames.ADMIN_DASHBOARD }, icon: 'pi pi-chart-bar'},
            { label: 'Análisis', to: { name: RouteNames.ADMIN_ANALYTICS }, icon: 'pi pi-chart-line'},
            { label: 'Ocupación de pistas', to: { name: RouteNames.ADMIN_OCCUPANCY }, icon: 'pi pi-percentage'},
        ]
    },
    {
        label: 'Gestión operativa',
        items: [
            { label: 'Gestión de pistas', to: { name: RouteNames.ADMIN_COURTS }, icon: 'pi pi-table'},
            { label: 'Calendario de eventos', to: { name: RouteNames.ADMIN_EVENTS }, icon: 'pi pi-calendar'},
            { label: 'Reservas', to: { name: RouteNames.ADMIN_RESERVATIONS }, icon: 'pi pi-ticket'},
            { label: 'Configurador de precios', to: { name: RouteNames.ADMIN_PRICE }, icon: 'pi pi-money-bill'},
        ]
    },
     {
        label: 'Gestión de accesos',
        items: [
            { label: 'Miembros del club', to: { name: RouteNames.ADMIN_MEMBERS }, icon: 'pi pi-users'},
        ]
    },
    {
        label: 'Configuración',
        items: [
            { label: 'Mi club', to: { name: RouteNames.ADMIN_CLUB }, icon: 'pi pi-home'},
            { label: 'Mi perfil', to: { name: RouteNames.ADMIN_PROFILE }, icon: 'pi pi-user'},
        ]
    }
];

const SUPER_ADMIN_MENU: AppNavigationGroup[] = [
    {
        label: 'Control Global',
        items: [
            { label: 'Global Dashboard', to: { name: RouteNames.MANAGEMENT_DASHBOARD }, icon: 'pi pi-globe' },
            { label: 'Análisis', to: { name: RouteNames.MANAGEMENT_ANALYTICS }, icon: 'pi pi-chart-line'},
            { label: 'Ocupación', to: { name: RouteNames.MANAGEMENT_OCCUPANCY }, icon: 'pi pi-percentage'},
            { label: 'Clubs', to: { name: RouteNames.MANAGEMENT_CLUBS }, icon: 'pi pi-shop' },
            { label: 'Usuarios', to: { name: RouteNames.MANAGEMENT_USERS }, icon: 'pi pi-users' },
        ]
    },
        {
        label: 'Configuración',
        items: [
            { label: 'Mi perfil', to: { name: RouteNames.ADMIN_PROFILE }, icon: 'pi pi-user'},
        ]
    }
];

const currentMenu = computed<AppNavigationGroup[]>(() => {
    if (authStore.role !== 'SuperAdmin'){
        return CLUB_ADMIN_MENU;
    }

    if (clubStore.activeClubId) {
        return CLUB_ADMIN_MENU;
    }

    return SUPER_ADMIN_MENU;
})

const headerTitle = computed(() => {
    if (authStore.role === 'SuperAdmin') return 'VoleApp Global Admin';
    if (isInitialLoading.value) return 'Cargando Club...'
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
    router.push( {name: RouteNames.HOME});
}

const getHomeRoute = () => {
    return authStore.isSuperadmin ? RouteNames.MANAGEMENT_DASHBOARD : RouteNames.ADMIN_DASHBOARD;
};


const exitSimulation = async () => {
    clubStore.clearClub();
    await nextTick();
    router.push({ name: RouteNames.MANAGEMENT_DASHBOARD });
};

watch(() => route.path, () => {
    showMobileMenu.value = false;
})

</script>

<template>
    <div class="h-screen flex w-full overflow-hidden xl:p-6 xl:gap-6">

        <Navbar
            class="!hidden xl:!block"
            :navigation-items="currentMenu"
            :home-route="getHomeRoute()"
        >
            <template #logo>
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-15 mb-2" 
                />
            </template>
        </Navbar>

        <NavbarMobile :is-open="showMobileMenu" @close="showMobileMenu = false">
            <div class="h-full w-full overflow-y-auto custom-scrollbar">
                <Navbar
                    class="w-full min-h-screen"
                    :navigation-items="currentMenu"
                    :home-route="getHomeRoute()"
                    is-mobile @close="showMobileMenu = false"
                >
                    <template #logo>
                        <img src="/src/assets/voleappblack.png" alt="VoleApp Logo" class="h-10 mb-2" />
                    </template>
                </Navbar>
            </div>
        </NavbarMobile>

        <main class="flex-1 flex flex-col h-full min-w-0 overflow-hidden overflow-y-auto">
            <header class="flex justify-between items-center pl-6 pr-6 pt-6 pb-2 md:pb-0">
                <div class="flex items-center gap-5">

                   <slot name="header-actions">
                        <button 
                            @click="showMobileMenu = true" 
                            class="xl:hidden p-2 bg-black text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all">
                                <i class="pi pi-bars text-xl text-white"></i>
                        </button>

                        <span class="hidden md:block text-sm font-bold text-gray-700 uppercase tracking-widest">
                            {{ headerTitle}}
                        </span>
                    </slot>

                    <div v-if="authStore.isSuperadmin && clubStore.activeClubId" 
                        class="flex items-center gap-2 bg-[#F3FAEA] px-3 py-1 rounded-full border border-[#C8E794]/70 shadow-sm animate-fade-in">
                        <i class="pi pi-eye text-[#6B8F3A] text-xs"></i>
                        <span class="text-[10px] font-bold text-[#6B8F3A] uppercase tracking-wider">
                            Simulando: {{ clubStore.currentClubData?.name }}
                        </span>
                        <button @click="exitSimulation" class="text-[#6B8F3A] transition">
                            <i class="pi pi-times text-[10px]"></i>
                        </button>
                    </div>
                </div>

                <div class="w-fit min-w-60">
                    <NavUserCard
                    :username="userStore.profile?.username ?? 'Cargando..'"
                    :user-role="authStore.role ?? 'Admin'"
                    :nagivate-to="RouteNames.ADMIN_PROFILE"
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