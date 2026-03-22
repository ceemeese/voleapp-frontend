<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
//import { useRouter } from 'vue-router';
import { computed } from 'vue';

import { Footer, HeaderM, type NavItem } from 'ui';

const userStore = useUserStore();
//const router = useRouter();

const isLogged = computed(() => userStore.isAuthenticated);


const publicHeaderLinks : NavItem[] = [
    { title: 'Inicio', to: {name: 'home'}, icon: 'pi pi-home', },
    { title: 'Usuarios', to: {name: 'login'}, icon: 'pi pi-users' },
    {title: 'Clubs', to: {name: 'login'}, icon: 'pi pi-shop' },
];


const footerLinks = computed<NavItem[]>(() => {
    const authLinks: NavItem[] = [
            { title: 'Soporte', to: { name: 'dashboard' } },
            { title: 'Términos', to: { name: 'dashboard' } },
            { title: 'Privacidad', to: { name: 'dashboard' } },
        ];

    const publicLinks: NavItem[] = [
            { title: 'Sobre Nosotros', to: { name: 'home' } },
            { title: 'Tarifas', to: { name: 'home' } },
            { title: 'Contacto', to: { name: 'home' }, },
        ]
        
    return userStore.isAuthenticated ? authLinks : publicLinks;
});


/*const handleLogout = () => {
    userStore.logout();
    router.push( {name: 'login'});
}*/


</script>



<template>
    <div class="ui:min-h-screen ui:flex ui:flex-col">
        <HeaderM
        v-if="!isLogged"
        :navigation-items="publicHeaderLinks"
        >
            <template #logo>
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-15 w-auto mb-2" 
                />
            </template>
        </HeaderM>

        <main :class="['flex-1', isLogged ? 'ml-80' : 'pt-32']">
            <RouterView />
            ESTO ES EL MAIN
        </main>


        <Footer 
        v-if="!isLogged"
        :navigation-items="footerLinks"
        title-logo="VoleApp"
        >
            <template #logo>
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-10 w-auto mb-2" 
                />
            </template>
        </Footer>
    </div>
</template>

<style>

:deep(.p-menu) {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
}

:deep(.p-menu-list) {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 1 auto !important;
}

:deep(.p-menu-end) {
    margin-top: auto !important;
}
</style>


