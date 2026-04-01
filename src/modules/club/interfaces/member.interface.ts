export interface Member {
    id: string;
    clubId: string;
    userId: string;
    role: string;
    membershipNumber: string;
    registeredOn: Date;
    isFavourite: boolean;
    isMember: boolean;
    isActive: boolean;
}