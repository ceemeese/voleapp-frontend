export interface PricingConfigResponse {
    id: number;
    clubId: string;
    rainDiscountPercent: number;
    windThreshold: number;
    windDiscountPercent: number;
    heatThreshold: number;
    heatDiscountPercent: number;
    coldThreshold: number;
    coldDiscountPercent: number;
}