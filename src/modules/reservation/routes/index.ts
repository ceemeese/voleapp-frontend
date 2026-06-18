import { RouteNames } from "@/router/routeNames";
import type { RouteRecordRaw } from "vue-router";

export const reservationRoutes: RouteRecordRaw[] = [
    {
        path: 'booking',
        name: RouteNames.BOOKING,
        component: () => import('@/modules/reservation/views/ReservationView.vue'),
    },
    {
        path: 'my-reservations',
        name: RouteNames.USER_RESERVATIONS,
        component: () => import('@/modules/reservation/views/MyReservationView.vue'),
    },
    {
        path: 'payment-success',
        name: RouteNames.PAYMENT_SUCCESS,
        component: () => import('@/modules/reservation/views/PaymentSuccessView.vue'),
    },
]