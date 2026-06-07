// src/modules/admin/superadmin.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const superAdminRoutes: RouteRecordRaw[] = [
    {
        path: 'management/dashboard',
        name: 'management-dashboard',
        component: () => import('@/modules/admin/views/DashboardManagementView.vue'),
        meta: { requiredRole: 'SuperAdmin' }
    },
    {  
        path: 'management/analytics',
        name: 'management-analytics',
        component: () => import('@/modules/admin/views/AnalyticsManagementView.vue'),
        meta: { requiredRole: 'SuperAdmin' }
    },
    {  
        path: 'management/occupancy',
        name: 'management-occupancy',
        component: () => import('@/modules/admin/views/OccupancyManagementView.vue'),
        meta: { requiredRole: 'SuperAdmin' }
    },
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
    }
];