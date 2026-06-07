import type { RouteRecordRaw } from "vue-router";

export const clubRoutes: RouteRecordRaw[] = [
    {
        path: 'members',
        name: 'admin-members',
        component: () => import('@/modules/club/views/MemberView.vue')
    },
    {  
        path: 'courts',
        name: 'admin-courts',
        component: () => import('@/modules/club/views/CourtView.vue'),
    },
    {  
        path: 'club',
        name: 'admin-club',
        component: () => import('@/modules/club/views/ClubView.vue'),
    },
    {  
        path: 'events',
        name: 'admin-events',
        component: () => import('@/modules/club/views/EventsView.vue'),
    },
    {  
        path: 'reservations',
        name: 'admin-reservations',
        component: () => import('@/modules/club/views/ReservationListView.vue'),
    },
    {  
        path: 'price',
        name: 'admin-price',
        component: () => import('@/modules/club/views/PriceConfigView.vue'),
    },
    {  
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/modules/club/views/DashboardView.vue'),
    },
    {  
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import('@/modules/club/views/AnalyticsView.vue'),
    },
    {  
        path: 'occupancy',
        name: 'admin-occupancy',
        component: () => import('@/modules/club/views/OccupancyView.vue'),
    },
]