import type { RoleType } from "./member.interface";

export interface UserClub {
    clubId: string;
    clubName: string;
    role: RoleType;
    isFavourite: boolean;
    isMember: boolean;
    membershipNumber?: string;
    isActive: boolean;
    registeredOn: Date;
}