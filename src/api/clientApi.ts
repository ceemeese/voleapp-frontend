import { useUserStore } from '@/stores/userStore';
import axios from 'axios'

const clientApi = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
});

//interceptores
clientApi.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if (userStore.token) {
        config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config;
})

export { clientApi };