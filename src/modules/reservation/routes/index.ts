import type { RouteRecordRaw } from "vue-router";

export const reservationRoutes: RouteRecordRaw[] = [
    {
        path: 'booking',
        name: 'booking',
        component: () => import('@/modules/reservation/views/ReservationView.vue'),
    },
]