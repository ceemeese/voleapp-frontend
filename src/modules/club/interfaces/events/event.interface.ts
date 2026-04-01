export interface Event {
    id: number;
    courtId: string;
    startTime: Date;
    endTime: Date;
    eventName: string;
    description?: string;
    createdAt: Date;
}