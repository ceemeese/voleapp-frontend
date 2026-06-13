import { adminRoutes } from '@/modules/admin/routes'
import { authRoutes } from '@/modules/auth/routes'
import { landingRoutes } from '@/modules/landing/routes'
import { userRoutes } from '@/modules/user/routes'
import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import { RouteNames } from './routeNames'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'mainLayout',
            component: () => import('@/layouts/MainLayout.vue'),
            children: [
              ...landingRoutes,
              userRoutes,
            ]
        },
        ...adminRoutes,
        authRoutes,      
        {
            path: '/:pathMatch(.*)*',
            name: RouteNames.NOT_FOUND,
            component: () => import('@/views/NotFoundView.vue'),
            meta: { requiresAuth: false }
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    }
})


router.beforeEach((to, from, next) => {
    const userStore = useAuthStore();
    const isAdminPath = to.path.startsWith('/admin');

    const isGuestOnly = to.matched.some(record => record.meta.guestOnly);
    if (isGuestOnly && userStore.isAuthenticated) {
        if (userStore.isSuperadmin) return next({ name: RouteNames.MANAGEMENT_DASHBOARD });
        if (userStore.isAdmin) return next({ name: RouteNames.ADMIN_DASHBOARD });
        return next({ name: RouteNames.USER_HOME });
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !userStore.isAuthenticated) {
        return next({ name: RouteNames.LOGIN });  
    }
    
    const requiresSuperAdmin = to.matched.some(record => record.meta.requiresSuperAdmin);
    if (requiresSuperAdmin && !userStore.isSuperadmin) {
        return userStore.isAdmin 
            ? next({ name: RouteNames.ADMIN_ROOT }) 
            : next({ name: RouteNames.USER_HOME });
    }

    if (isAdminPath && !userStore.isSuperadmin && !userStore.isAdmin) {
        return next({ name: RouteNames.USER_HOME });
    }

    next();
});

export default router
