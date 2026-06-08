import { RouteNames } from "@/router/routeNames";
import type { RouteRecordRaw } from "vue-router";

export const clubRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: { name: RouteNames.ADMIN_DASHBOARD }
    },
    {
        path: 'members',
        name: RouteNames.ADMIN_MEMBERS,
        component: () => import('@/modules/club/views/MemberView.vue')
    },
    {  
        path: 'courts',
        name: RouteNames.ADMIN_COURTS,
        component: () => import('@/modules/club/views/CourtView.vue'),
    },
    {  
        path: 'club',
        name: RouteNames.ADMIN_CLUB,
        component: () => import('@/modules/club/views/ClubView.vue'),
    },
    {  
        path: 'events',
        name: RouteNames.ADMIN_EVENTS,
        component: () => import('@/modules/club/views/EventsView.vue'),
    },
    {  
        path: 'reservations',
        name: RouteNames.ADMIN_RESERVATIONS,
        component: () => import('@/modules/club/views/ReservationListView.vue'),
    },
    {  
        path: 'price',
        name: RouteNames.ADMIN_PRICE,
        component: () => import('@/modules/club/views/PriceConfigView.vue'),
    },
    {  
        path: 'dashboard',
        name: RouteNames.ADMIN_DASHBOARD,
        component: () => import('@/modules/club/views/DashboardView.vue'),
    },
    {  
        path: 'analytics',
        name: RouteNames.ADMIN_ANALYTICS,
        component: () => import('@/modules/club/views/AnalyticsView.vue'),
    },
    {  
        path: 'occupancy',
        name: RouteNames.ADMIN_OCCUPANCY,
        component: () => import('@/modules/club/views/OccupancyView.vue'),
    },
]