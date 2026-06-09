import { defineStore } from "pinia"
import { ref } from "vue";
import { computed } from "vue";
import { jwtDecode } from "jwt-decode";

interface TokenInfo {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string,
    sub: string;
    email: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
}


    

export const useAuthStore = defineStore('auth', () => {
    
    const userStore = useUserStore();
    const clubStore = useClubStore();
    
    const token = ref<string | undefined>(undefined);
    const refreshToken = ref<string | undefined>(undefined);


    const isAuthenticated = computed(() => token.value !== undefined);

    /*const tokenInfo = computed(() => 
        (!isAuthenticated.value || !token.value) ? undefined : jwtDecode<TokenInfo>(token.value));*/

    const tokenInfo = computed(() => {
        if (!isAuthenticated.value || !token.value) return undefined;
        const decoded = jwtDecode<TokenInfo>(token.value);
        return decoded;
    })

    const role = computed(() => 
        tokenInfo.value?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    );

    const isSuperadmin = computed(() => role.value === 'SuperAdmin') ;

    const isAdmin = computed(() => role.value === 'Admin' || role.value === 'SuperAdmin');

    const userId = computed(() => tokenInfo.value?.sub);
    const username = computed(() => tokenInfo.value?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const email = computed(() => tokenInfo.value?.email)

    function setToken(newToken : string) {
        token.value = newToken;
    }

    function setRefreshToken(newToken : string) {
        refreshToken.value = newToken;
    }

    function logout() {
        token.value = undefined;
        refreshToken.value = undefined;

        userStore.clearProfile();
        clubStore.clearClub();

        localStorage.clear();
    }


  return { 
        token,
        tokenInfo,
        refreshToken, 
        setToken, 
        setRefreshToken,
        logout,
        isAuthenticated,
        isSuperadmin,
        isAdmin,
        userId,
        username,
        role,
        email,
    }

},
{
    persist: {
        key: 'voleapp-auth',
        storage: localStorage,
        pick: ["token", "refreshToken"],
    }
});