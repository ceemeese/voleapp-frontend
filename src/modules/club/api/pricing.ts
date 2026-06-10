import type { AxiosRequestConfig } from "axios";
import type { PutPricingConfig } from "../interfaces";

const baseURL = "api/clubs";

function getPricingConfig(clubId: string) : AxiosRequestConfig {
    return {
        method: 'GET',
        url: `${baseURL}/${clubId}/pricing-config`,
    }
}

function putPricingConfig(clubId: string, data: PutPricingConfig) : AxiosRequestConfig<PutPricingConfig> {
    return {
        method: 'PUT',
        url: `${baseURL}/${clubId}/pricing-config`,
        data: data
    }
}


export default {
    getPricingConfig,
    putPricingConfig,
}