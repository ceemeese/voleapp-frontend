import { defineStore } from "pinia"
import { ref } from "vue";
import { computed } from "vue";
import { jwtDecode } from "jwt-decode";

interface TokenInfo {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid": string;
}


    

export const useUserStore = defineStore('user', () => {
    const token = ref<string | undefined>(undefined);
    const refreshToken = ref<string | undefined>(undefined);

    const isAuthenticated = computed(() => token.value !== undefined);

    const tokenInfo = computed(() => 
        (!isAuthenticated.value || !token.value) ? undefined : jwtDecode<TokenInfo>(token.value));

    const role = computed(() => 
        tokenInfo.value?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    );

    const isSuperadmin = computed(() => role.value === 'Superadmin') ;

    const isAdmin = computed(() => role.value === 'Admin' || role.value === 'Superadmin');

    const userId = computed(() => tokenInfo.value?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"]);
    

    function setToken(newToken : string) {
        token.value = newToken;
    }

    function setRefreshToken(newToken : string) {
        refreshToken.value = newToken;
    }

    function logout() {
        token.value = undefined;
        refreshToken.value = undefined;
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
    }

},
{
    persist: {
        key: 'voleapp-auth',
        storage: localStorage,
        pick: ["token", "refreshToken"],
    }
});