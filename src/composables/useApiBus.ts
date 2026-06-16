import { useEventBus } from '@vueuse/core';

export const apiErrorBus = useEventBus<string>('api-error');