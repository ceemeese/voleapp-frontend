export interface MemberResponse {
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