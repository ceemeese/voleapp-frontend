import { useAuthStore } from '@/stores/authStore';
import axios from 'axios'

const clientApi = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
});

//interceptores
clientApi.interceptors.request.use((config) => {
    const userStore = useAuthStore();
    if (userStore.token) {
        config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config;
})


clientApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const userStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
        
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                    token: userStore.token,
                    refreshToken: userStore.refreshToken
                });

                userStore.setToken(data.token);
                userStore.setRefreshToken(data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.token}`
                return clientApi(originalRequest);
            
            } catch (refreshError){
                userStore.logout();
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }

        }

        return Promise.reject(error);
    }
)

export { clientApi };