import { reservationRoutes } from "@/modules/reservation/routes";
import { RouteNames } from "@/router/routeNames";
import{ type RouteRecordRaw, RouterView } from "vue-router";

export const userRoutes: RouteRecordRaw = {
    path: '/user',
    component: RouterView,
    meta: { requiresAuth: true },
    children: [
        {
            path: '',
            redirect: { name: RouteNames.USER_HOME }
        },
        {
            path: 'home',
            name: RouteNames.USER_HOME,
            component: () => import('@/modules/user/views/UserDashboardView.vue'),
        },
        {
            path: 'profile',
            name: RouteNames.USER_PROFILE,
            component: () => import('@/modules/user/views/ProfileView.vue'),
        },
        ...reservationRoutes
    ]
}