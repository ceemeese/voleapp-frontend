import { reservationRoutes } from "@/modules/reservation/routes";
import{ type RouteRecordRaw, RouterView } from "vue-router";

export const userRoutes: RouteRecordRaw = {
    path: '/user',
    component: RouterView,
    meta: { requiresAuth: true, requiresAdmin: false},
    children: [
        {
            path: 'home',
            name: 'user-home',
            component: () => import('@/modules/user/views/UserDashboardView.vue'),
        },
        {
            path: 'profile',
            name: 'user-profile',
            component: () => import('@/modules/user/views/ProfileView.vue'),
        },
        ...reservationRoutes
    ]
}