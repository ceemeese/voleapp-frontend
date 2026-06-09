
import { getPricingConfigAction } from "@/modules/club/actions/pricing/get-pricing-config.action";
import { updatePricingConfigAction } from "@/modules/club/actions/pricing/update-pricing-config.action";
import type { PricingConfig, PutPricingConfig } from "@/modules/club/interfaces";
import { ref } from "vue";

export const usePricingConfig = () => {
    const isLoading = ref<boolean>(false);

    const getPricing = async (clubId: string): Promise<PricingConfig> => {
        isLoading.value = true;

        try {
            const data: PricingConfig = await getPricingConfigAction(clubId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updatePricingConfig = async (clubId: string, dataForm: PutPricingConfig): Promise<PricingConfig> => {
        isLoading.value = true;

        try {
            const data: PricingConfig = await updatePricingConfigAction(clubId, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    return {
        getPricing,
        updatePricingConfig,
    }
}