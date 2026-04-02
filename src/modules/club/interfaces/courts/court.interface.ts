export interface Court {
    id: string;
    clubId: string;
    name: string;
    type: CourtType;
    basePrice: number;
    isActive: boolean;
    createdAt: Date;
}

export interface CourtType {
    id: number;
    day: string;
}