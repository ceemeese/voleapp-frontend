<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import type { AppNavigationGroup } from '@/types/navigation';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useClub } from '@/composables/useClub';

const { getAdminContext } = useClub();
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
        
        console.log(userStore.profile?.username, 'Apodo');
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
            //{ label: 'Usuarios', to: {name: 'admin-users'}, icon: 'pi pi-users'},
            { label: 'Miembros del club', to: {name: 'admin-members'}, icon: 'pi pi-users'},
            { label: 'Mi perfil', to: {name: 'admin-profile'}, icon: 'pi pi-user'},
        ]
    }
]


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
            :username="userStore.profile?.username"
            :user-role="authStore.role"
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
                <div v-if="isInitialLoading" class="flex items-center justify-center h-full">
                    <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                </div>
                <RouterView />
        </main>

    </div>
</template>

<style>

</style>
