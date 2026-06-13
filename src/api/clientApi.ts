import router from '@/router'
import { RouteNames } from '@/router/routeNames';
import type { InternalAxiosRequestConfig } from 'axios';
import { useGlobalLoading } from '@/composables/useGlobalLoading';

const { start, stop } = useGlobalLoading();

const clientApi = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
});

type FailedRequest = {
    resolve: (value : unknown ) => void;
    config : InternalAxiosRequestConfig;
};

let isRefreshing = false;
let failedQueue : FailedRequest[] = []

//interceptores
clientApi.interceptors.request.use((config) => {

    if (!config.headers['x-no-loading']) {
        start();
    }

    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config;
})


clientApi.interceptors.response.use(
    (response) => { 
        stop();
        return response;
    },
    async (error) => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            stop();
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newToken = await authStore.refresh();

                    failedQueue.forEach(({ resolve, config }) => {
                        config.headers.Authorization = `Bearer ${newToken}`
                        resolve(clientApi(config))
                    });

                    failedQueue = []

                    originalRequest.headers.Authorization = `Bearer ${ newToken }`
                    return clientApi(originalRequest);
                
                } catch (refreshError){
                    failedQueue.forEach(({ resolve }) => resolve(Promise.reject(refreshError)));
                    failedQueue = []

                    authStore.logout();
                    router.push(RouteNames.LOGIN);
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }   
            
            } else {
                return new Promise((resolve) => {
                    failedQueue.push({ resolve, config: originalRequest });
                });
            }
        }
        return Promise.reject(error);
    }
)

export { clientApi };