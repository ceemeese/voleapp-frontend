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
        component: () => import('@/modules/club/views/MemberView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'courts',
        name: RouteNames.ADMIN_COURTS,
        component: () => import('@/modules/club/views/CourtView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'club',
        name: RouteNames.ADMIN_CLUB,
        component: () => import('@/modules/club/views/ClubView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'events',
        name: RouteNames.ADMIN_EVENTS,
        component: () => import('@/modules/club/views/CalendarView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'reservations',
        name: RouteNames.ADMIN_RESERVATIONS,
        component: () => import('@/modules/club/views/ReservationListView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'price',
        name: RouteNames.ADMIN_PRICE,
        component: () => import('@/modules/club/views/PriceConfigView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'dashboard',
        name: RouteNames.ADMIN_DASHBOARD,
        component: () => import('@/modules/club/views/DashboardView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'analytics',
        name: RouteNames.ADMIN_ANALYTICS,
        component: () => import('@/modules/club/views/AnalyticsView.vue'),
        meta: { requiresActiveClub: true }
    },
    {
        path: 'occupancy',
        name: RouteNames.ADMIN_OCCUPANCY,
        component: () => import('@/modules/club/views/OccupancyView.vue'),
        meta: { requiresActiveClub: true }
    },
]
