import type { User } from "@/modules/user/interfaces";
import { defineStore } from "pinia"
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { useUser } from "@/composables/useUser";


export const useUserStore = defineStore('user', () => {

    const authStore = useAuthStore();
    const profile = ref<User | undefined>(undefined);
    const { getUserById } = useUser()


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
    }

    return {
        fetchProfile,
        clearProfile,
        profile
    }
})