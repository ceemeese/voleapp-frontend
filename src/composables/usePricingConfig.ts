import { getPricingConfigAction } from "@/modules/club/actions/pricing/get-pricing-config.action";
import { updatePricingConfigAction } from "@/modules/club/actions/pricing/update-pricing-config.action";
import type { PricingConfig, PutPricingConfig } from "@/modules/club/interfaces";


export const usePricingConfig = () => {

    const getPricing = (clubId: string): Promise<PricingConfig> => {
        return getPricingConfigAction(clubId);
    }

    const updatePricingConfig = (clubId: string, dataForm: PutPricingConfig): Promise<PricingConfig> => {
        return updatePricingConfigAction(clubId, dataForm);
    }

    return {
        getPricing,
        updatePricingConfig,
    }
}