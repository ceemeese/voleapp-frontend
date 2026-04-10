import type { Club } from "@/modules/club/interfaces";
import { defineStore } from "pinia"
import { ref } from "vue";

export const useClubStore = defineStore('club', () => {
    const activeClubId = ref<string| null>(null);
    const currentClubData = ref<Club | null>(null);

    function clearClub() {
        activeClubId.value = null;
        currentClubData.value = null;
    }

    return { activeClubId, currentClubData, clearClub }
})