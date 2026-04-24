export interface MemberResponse {
    id: number;
    userId: string;
    name: string;
    lastName: string;
    email: string;
    role: RoleTypeResponse;
    isMember: boolean;
    membershipNumber: string;
    isFavourite: boolean;
    isActive: boolean;
    registeredOn: string;
}

export interface RoleTypeResponse {
    id: number;
    name: string;
}