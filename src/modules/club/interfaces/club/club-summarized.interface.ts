import type { AddressResponse } from "./address.response";

export interface SummarizedClub {
    id: string;
    name: string;
    address: AddressResponse;
    isActive: boolean;
}