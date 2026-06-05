import { clubRoutes } from "@/modules/club/routes";
import type { RouteRecordRaw } from "vue-router";
import { superAdminRoutes } from "./superadmin.routes";

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'admin-root',
        meta: { requiresAuth: true },
        component: () => import('@/layouts/AdminLayout.vue'),
        children: [
            {
                path: 'profile',
                name: 'admin-profile',
                component: () => import('@/modules/user/views/ProfileView.vue'),
                meta: {role: 'Superadmin'}
            },
            ...clubRoutes,
            ...superAdminRoutes
        ]
    },
]