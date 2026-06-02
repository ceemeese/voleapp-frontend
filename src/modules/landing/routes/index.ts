import type { RouteRecordRaw } from "vue-router";

export const landingRoutes: RouteRecordRaw[] = [
    {
        path: '',
        name: 'home',
        component: () => import('@/modules/landing/views/HomeView.vue'),
    },
    {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/modules/landing/views/UserInfoView.vue'),
    },
    {
        path: 'clubs',
        name: 'clubs',
        component: () => import('@/modules/landing/views/ClubsInfoView.vue'),
    },
    {
        path: 'about-us',
        name: 'about',
        component: () => import('@/modules/landing/views/AboutView.vue'),
    },
    {
        path: 'contact',
        name: 'contact',
        component: () => import('@/modules/landing/views/ContactView.vue'),
    },
        {
        path: 'privacy',
        name: 'privacy',
        component: () => import('@/modules/landing/views/PrivacyView.vue'),
    },
    {
        path: 'terms',
        name: 'terms',
        component: () => import('@/modules/landing/views/TermsView.vue')
    }
]