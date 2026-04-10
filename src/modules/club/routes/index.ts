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
]