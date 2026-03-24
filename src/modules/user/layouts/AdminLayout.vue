<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import type { AppNavigationGroup } from '@/types/navigation';
import { useRouter } from 'vue-router';

const userStore = useAuthStore();
const router = useRouter();

const ADMIN_MENU : AppNavigationGroup[] = [
    {
        label: 'Análisis y rendimiento',
        items: [
            { label: 'Dashboard', to: {name: 'login'}, icon: 'pi pi-chart-bar'},
            { label: 'Análisis', to: {name: 'login'}, icon: 'pi pi-chart-line'},
            { label: 'Ocupación de pistas', to: {name: 'login'}, icon: 'pi pi-percentage'},
        ]
    },
    {
        label: 'Gestión operativa',
        items: [
            { label: 'Gestión de pistas', to: {name: 'login'}, icon: 'pi pi-map'},
            { label: 'Calendario y reservas', to: {name: 'login'}, icon: 'pi pi-calendar'},
            { label: 'Configurador de precios', to: {name: 'login'}, icon: 'pi pi-money-bill'},
        ]
    },
     {
        label: 'Gestión de accesos',
        items: [
            { label: 'Usuarios', to: {name: 'admin-users'}, icon: 'pi pi-users'},
            { label: 'Mi perfil', to: {name: 'admin-profile'}, icon: 'pi pi-user'},
        ]
    }
]


const handleLogout = () => {
    userStore.logout();
    router.push( {name: 'login'});
}

</script>

<template>
    <div class="h-screen flex overflow-hidden bg-gray-50 p-6 gap-6">

        <Navbar
            :username="userStore.username"
            :user-role="userStore.role"
            :navigation-items="ADMIN_MENU"
            @logout="handleLogout"
            
        >
            <template #logo>
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-15 mb-2" 
                />
            </template>
        </Navbar>

        <main class="flex-1">
                <RouterView />
        </main>

    </div>
</template>

<style>

</style>
