<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
//import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { Footer, HeaderM, type NavItem } from 'ui';

const userStore = useAuthStore();
//const router = useRouter();

const isUserLogged = computed(() => userStore.isAuthenticated && !userStore.isAdmin);

const headerLinks = computed<NavItem[]>(() => {
        const publicHeaderLinks : NavItem[] = [
        { title: 'Inicio', to: {name: 'home'}, icon: 'pi pi-home', },
        { title: 'Usuarios', to: {name: 'login'}, icon: 'pi pi-users' },
        {title: 'Clubs', to: {name: 'login'}, icon: 'pi pi-shop' },
    ];

    const authHeaderLinks : NavItem[] = [
        { title: 'Inicio', to: {name: 'home'}, icon: 'pi pi-home', },
        { title: 'Reservar', to: {name: 'login'}, icon: 'pi pi-book' },
        {title: 'Perfil', to: {name: 'profile'}, icon: 'pi pi-user' },
    ]

    return isUserLogged.value ? authHeaderLinks : publicHeaderLinks;
})


const footerLinks = computed<NavItem[]>(() => {
    const authFooterLinks: NavItem[] = [
            { title: 'Soporte', to: { name: 'login' } },
            { title: 'Términos', to: { name: 'login' } },
            { title: 'Privacidad', to: { name: 'login' } },
        ];

    const publicFooterLinks: NavItem[] = [
            { title: 'Sobre Nosotros', to: { name: 'home' } },
            { title: 'Tarifas', to: { name: 'home' } },
            { title: 'Contacto', to: { name: 'home' }, },
        ]
        
    return isUserLogged.value ? authFooterLinks : publicFooterLinks;
});

/*const handleLogout = () => {
    userStore.logout();
    router.push( {name: 'login'});
}*/


</script>

<template>
    <div class="ui:min-h-screen ui:flex ui:flex-col">
        <HeaderM
        :navigation-items="headerLinks"
        class="header-shrink"
        >
            <template #logo>
                <img 
                    src="/src/assets/voleappblack.png" 
                    alt="VoleApp Logo" 
                    class="h-10 sm:h-15 w-auto" 
                />
            </template>
        </HeaderM>

        <main class="flex-1 w-full mx-auto flex flex-col items-center">
            <RouterView />
        </main>


        <Footer 
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

.header-shrink {
    backdrop-filter: blur(12px);

    transition: all 0.3s ease-in-out;
}
</style>