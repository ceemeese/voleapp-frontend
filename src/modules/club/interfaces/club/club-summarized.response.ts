import type { AddressResponse } from "./address.response";

export interface SummarizedClubResponse {
    id: string,
    name: string,
    address: AddressResponse,
    isActive: boolean,
}