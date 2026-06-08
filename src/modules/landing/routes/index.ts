import { RouteNames } from "@/router/routeNames";
import type { RouteRecordRaw } from "vue-router";

export const landingRoutes: RouteRecordRaw[] = [
    {
        path: '',
        name: RouteNames.HOME,
        component: () => import('@/modules/landing/views/HomeView.vue'),
    },
    {
        path: 'usuarios',
        name: RouteNames.PUBLIC_USERS,
        component: () => import('@/modules/landing/views/UserInfoView.vue'),
    },
    {
        path: 'clubs',
        name: RouteNames.PUBLIC_CLUBS,
        component: () => import('@/modules/landing/views/ClubsInfoView.vue'),
    },
    {
        path: 'about-us',
        name: RouteNames.PUBLIC_ABOUT,
        component: () => import('@/modules/landing/views/AboutView.vue'),
    },
    {
        path: 'contact',
        name: RouteNames.PUBLIC_CONTACT,
        component: () => import('@/modules/landing/views/ContactView.vue'),
    },
        {
        path: 'privacy',
        name: RouteNames.PUBLIC_PRIVACY,
        component: () => import('@/modules/landing/views/PrivacyView.vue'),
    },
    {
        path: 'terms',
        name: RouteNames.PUBLIC_TERMS,
        component: () => import('@/modules/landing/views/TermsView.vue')
    }
]