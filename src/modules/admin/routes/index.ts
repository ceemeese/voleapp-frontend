import { clubRoutes } from "@/modules/club/routes";
import type { RouteRecordRaw } from "vue-router";

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'admin',
        meta: { requiresAuth: true, requiresAdmin: true},
        component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
        children: [
            {
                path: 'users',
                name: 'admin-users',
                component: () => import('@/modules/admin/views/UserListView.vue'),
            },
            {
                path: 'profile',
                name: 'admin-profile',
                component: () => import('@/modules/user/views/ProfileView.vue'),
                meta: {role: 'Superadmin'}
            },
            ...clubRoutes
        ]
    },
]