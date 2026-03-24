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
        console.log('Perfil desde Store user', profile.value)
        if (profile.value){
            console.log('Perfil ya cargado', profile.value)
            return;
        } 
        if (!authStore.userId) {
            console.log('Sale de authStore porque es falso')
            console.log(authStore.userId, 'USERID')
            if(authStore.token) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            return;
        }

        profile.value = await getUserById(authStore.userId)
        console.log('Perfil desde Store user', profile.value)
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