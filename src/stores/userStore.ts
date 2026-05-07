import type { User } from "@/modules/user/interfaces";
import { defineStore } from "pinia"
import { ref, computed} from "vue";
import { useAuthStore } from "./authStore";
import { useUser } from "@/composables/useUser";
import type { Reservation } from "@/modules/reservation/interfaces";


export const useUserStore = defineStore('user', () => {

    const authStore = useAuthStore();
    const profile = ref<User | undefined>(undefined);
    const { getUserById } = useUser()
    const reservations = ref<Reservation[]>([]);

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


    function setReservations(data: Reservation[]) {
        reservations.value = data;
    }

    function addReservation(reservation: Reservation) {
        reservations.value.push(reservation);
        reservations.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return {
        fetchProfile,
        clearProfile,
        profile,
        hasReservations,
        setReservations,
        addReservation,
        reservations
    }
})