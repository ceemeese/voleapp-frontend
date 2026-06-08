import { clubRoutes } from "@/modules/club/routes";
import type { RouteRecordRaw } from "vue-router";
import { superAdminRoutes } from "./superadmin.routes";
import { RouteNames } from "@/router/routeNames";

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: RouteNames.ADMIN_ROOT,
        meta: { requiresAuth: true },
        component: () => import('@/layouts/AdminLayout.vue'),
        children: [
            {
                path: 'profile',
                name: RouteNames.ADMIN_PROFILE,
                component: () => import('@/modules/user/views/ProfileView.vue'),
            },
            ...clubRoutes,
            ...superAdminRoutes,
        ]
    },
]