import { defineStore } from "pinia"
import { ref } from "vue";

export const useClubStore = defineStore('club', () => {
    const activeClubId = ref<string| null>(null);

    return { activeClubId }
})