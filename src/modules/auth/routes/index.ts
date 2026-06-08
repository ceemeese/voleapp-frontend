import { RouteNames } from "@/router/routeNames";
import type { RouteRecordRaw } from "vue-router";

export const authRoutes: RouteRecordRaw = {
    path: '/auth',
    name: RouteNames.AUTH,
    redirect: { name: RouteNames.LOGIN },
    component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
    children: [
        {
            path: 'login',
            name: RouteNames.LOGIN,
            component: () => import('@/modules/auth/views/LoginView.vue'),
        },
                {
            path: 'register',
            name: RouteNames.REGISTER,
            component: () => import('@/modules/auth/views/RegisterView.vue'),
        }
    ]
}