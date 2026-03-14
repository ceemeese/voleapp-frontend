import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw = {
    path: '/user',
    name: 'user',
    redirect: { name: 'profile' },
    component: () => import('@/modules/user/layouts/UserLayout.vue'),
    children: [
        {
            path: 'profile',
            name: 'profile',
            component: () => import('@/modules/user/views/ProfileView.vue'),
        },
        {
            path: 'users',
            name: 'users',
            component: () => import('@/modules/user/views/UserListView.vue'),
        },
    ]
}