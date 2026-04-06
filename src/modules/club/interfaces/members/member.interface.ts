export interface Member {
    id: number;
    clubId: string;
    userId: string;
    role: RoleType;
    membershipNumber: string;
    registeredOn: Date;
    isFavourite: boolean;
    isMember: boolean;
    isActive: boolean;
}

export interface RoleType {
    id: number;
    name: string;
}

