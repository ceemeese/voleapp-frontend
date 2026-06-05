// src/modules/admin/superadmin.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const superAdminRoutes: RouteRecordRaw[] = [
    {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/modules/admin/views/UserListView.vue'),
        meta: { requiredRole: 'SuperAdmin' }
    },
    {
        path: 'clubs',
        name: 'admin-clubs',
        component: () => import('@/modules/admin/views/ClubListView.vue'),
        meta: { requiredRole: 'SuperAdmin' }
    },
];