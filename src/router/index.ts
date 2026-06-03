import { adminRoutes } from '@/modules/admin/routes'
import { authRoutes } from '@/modules/auth/routes'
import { landingRoutes } from '@/modules/landing/routes'
import { userRoutes } from '@/modules/user/routes'
import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

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

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
      return next({ name: 'login' });  
    } 
    
    if (to.meta.requiresSuperadmin && !userStore.isSuperadmin) {
      return next({ name: 'user-home' });
    }

    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      return next({ name: 'user-home' });
    }

    next();
});

export default router
