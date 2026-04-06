import type { RoleType } from "./member.interface";

export interface MemberComplete {
    id: number;
    userId: string;
    name: string;
    lastName: string;
    email: string;
    role: RoleType;
    isMember: boolean;
    membershipNumber: string;
    isFavourite: boolean;
    isActive: boolean;
    registeredOn: Date;
}