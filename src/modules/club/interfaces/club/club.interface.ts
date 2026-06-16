import type { Address } from "./address.interface";

export interface Club {
    id: string,
    name: string,
    address: Address,
    phoneNumber: string,
    email: string,
    isActive: boolean,
    createdAt: Date,
}