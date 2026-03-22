import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw = {
    path: '/admin',
    name: 'admin',
    component: () => import('@/modules/user/layouts/AdminLayout.vue'),
    children: [
        {
            path: 'users',
            name: 'admin-users',
            component: () => import('@/modules/user/views/UserListView.vue'),
        },
        {
            path: 'profile',
            name: 'admin-profile',
            component: () => import('@/modules/user/views/UserListView.vue'),
        },
        {
            path: 'user-edit/:id',
            name: 'user-edit',
            component: () => import('@/modules/user/views/UserListView.vue'),
            props: true
        },
    ]
}