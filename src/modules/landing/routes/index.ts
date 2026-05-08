import type { RouteRecordRaw } from "vue-router";

export const landingRoutes: RouteRecordRaw[] = [
    {
        path: '',
        name: 'home',
        component: () => import('@/modules/landing/views/HomeView.vue'),
    },
]