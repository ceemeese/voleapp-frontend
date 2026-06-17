import type { RoleTypeResponse } from "./member.response";

export interface UserClubResponse {
    clubId: string;
    clubName: string;
    role: RoleTypeResponse;
    isFavourite: boolean;
    isMember: boolean;
    membershipNumber?: string;
    isActive: boolean;
    registeredOn: string;
}