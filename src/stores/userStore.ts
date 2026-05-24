import type { User } from "@/modules/user/interfaces";
import { defineStore } from "pinia"
import { ref, computed} from "vue";
import { useAuthStore } from "./authStore";
import { useUser } from "@/composables/useUser";
import type { ReservationComplete } from "@/modules/reservation/interfaces";


export const useUserStore = defineStore('user', () => {

    const authStore = useAuthStore();
    const profile = ref<User | undefined>(undefined);
    const { getUserById } = useUser()
    const reservations = ref<ReservationComplete[]>([]);

    const hasReservations = computed(() => reservations.value.length > 0);

    async function fetchProfile() {
        if (profile.value){
            return;
        } 
        if (!authStore.userId) {
            if(authStore.token) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            return;
        }

        profile.value = await getUserById(authStore.userId)
    }

    function clearProfile() {
        profile.value = undefined;
        reservations.value = [];
    }


    function setReservations(data: ReservationComplete[]) {
        reservations.value = data;
    }

    function upsertReservations(newReservations: ReservationComplete[]){
        const cacheMap = new Map(reservations.value.map(res => [res.id, res] ));
        newReservations.forEach(res => cacheMap.set(res.id, res));
        reservations.value = Array.from(cacheMap.values());
    }

    return {
        fetchProfile,
        clearProfile,
        profile,
        hasReservations,
        setReservations,
        reservations,
        upsertReservations
    }
})