import { authRoutes } from '@/modules/auth/routes'
import { landingRoutes } from '@/modules/landing/routes'
import { useUserStore } from '@/stores/userStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //AuthRoutes
    landingRoutes,
    authRoutes,
  ],
})


router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

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
