const activeRequests = ref(0);

export const useGlobalLoading = () => {
    const isLoading = computed(() => activeRequests.value > 0);

    const start = () => activeRequests.value++;
    
    const stop = () => {
        activeRequests.value = Math.max(0, activeRequests.value - 1);
        console.log('Requests activas:', activeRequests.value);

        activeRequests.value = Math.max(0, activeRequests.value - 1);
    
        console.log('Requests activas actuales:', activeRequests.value); 

        if (activeRequests.value === 0) {
            console.log('UI desbloqueada');
        }
        };

    return { isLoading, start, stop };
};