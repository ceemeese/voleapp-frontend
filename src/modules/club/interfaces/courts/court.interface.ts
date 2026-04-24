export interface Court {
    id: string;
    clubId: string;
    name: string;
    courtType: CourtType;
    basePrice: number;
    isActive: boolean;
    createdAt: Date;
}

export interface CourtType {
    id: number;
    name: string;
}