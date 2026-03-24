import type { RouteRecordRaw } from "vue-router";

export const landingRoutes: RouteRecordRaw = {
    path: '/',
    name: 'landing',
    component: () => import('@/modules/landing/layouts/LandingLayout.vue'),
    children: [
        {
            path: '',
            name: 'home',
            component: () => import('@/modules/landing/views/HomeView.vue')
        },
        {
            path: 'profile',
            name: 'profile',
            component: () => import('@/modules/user/views/ProfileView.vue')
        }
    ]
}