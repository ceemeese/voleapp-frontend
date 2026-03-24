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

export { clientApi };