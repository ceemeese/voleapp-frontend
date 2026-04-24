import type { AddressResponse } from "./address.response";

export interface ClubResponse {
    id: string;
    name: string;
    cif: string;
    address: AddressResponse;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}