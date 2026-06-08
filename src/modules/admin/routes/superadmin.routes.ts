import { RouteNames } from "@/router/routeNames";
import type { RouteRecordRaw } from "vue-router";

export const superAdminRoutes: RouteRecordRaw[] = [
    {
        path: 'management/dashboard',
        name: RouteNames.MANAGEMENT_DASHBOARD,
        component: () => import('@/modules/admin/views/DashboardManagementView.vue'),
        meta: { requiresSuperAdmin: true }
    },
    {  
        path: 'management/analytics',
        name: RouteNames.MANAGEMENT_ANALYTICS,
        component: () => import('@/modules/admin/views/AnalyticsManagementView.vue'),
        meta: { requiresSuperAdmin: true }
    },
    {  
        path: 'management/occupancy',
        name: RouteNames.MANAGEMENT_OCCUPANCY,
        component: () => import('@/modules/admin/views/OccupancyManagementView.vue'),
        meta: { requiresSuperAdmin: true }
    },
    {
        path: 'users',
        name: RouteNames.MANAGEMENT_USERS,
        component: () => import('@/modules/admin/views/UserListView.vue'),
        meta: { requiresSuperAdmin: true }
    },
    {
        path: 'clubs',
        name: RouteNames.MANAGEMENT_CLUBS,
        component: () => import('@/modules/admin/views/ClubListView.vue'),
        meta: { requiresSuperAdmin: true }
    }
];