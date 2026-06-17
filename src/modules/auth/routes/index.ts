import { RouteNames } from "@/router/routeNames";
import type { RouteRecordRaw } from "vue-router";

export const authRoutes: RouteRecordRaw = {
    path: '/auth',
    name: RouteNames.AUTH,
    meta: { guestOnly: true },
    redirect: { name: RouteNames.LOGIN },
    component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
    children: [
        {
            path: 'login',
            name: RouteNames.LOGIN,
            component: () => import('@/modules/auth/views/LoginView.vue'),
            meta: { 
                authImage: '/src/assets/authimage.jpg',
                blurImage: '/src/assets/auth-blur.jpg' }
        },
        {
            path: 'register',
            name: RouteNames.REGISTER,
            component: () => import('@/modules/auth/views/RegisterView.vue'),
            meta: { 
                authImage: '/src/assets/authimage2.jpg',
                blurImage: '/src/assets/auth-blur2.jpg' }
            
        },
        {
            path: 'forgot',
            name: RouteNames.FORGOT,
            component: () => import('@/modules/auth/views/ForgotPasswordView.vue'),
            meta: { 
                authImage: '/src/assets/authimage3.jpg',
                blurImage: '/src/assets/auth-blur3.jpg' }
        },
        {
            path: 'reset-password',
            name: RouteNames.RESET,
            component: () => import('@/modules/auth/views/ResetPasswordView.vue'),
            meta: { authImage: '/src/assets/authimage3.jpg' },
            props: route => ({
                token: route.query.token,
                email: route.query.email
            })
        },
        {
            path: 'confirm-email',
            name: RouteNames.CONFIRM_EMAIL,
            component: () => import('@/modules/auth/views/ConfirmEmailView.vue'),
            meta: { authImage: '/src/assets/authimage2.jpg' },
            props: route => ({
                token: route.query.token,
                email: route.query.email
            })
        },
    ]
}