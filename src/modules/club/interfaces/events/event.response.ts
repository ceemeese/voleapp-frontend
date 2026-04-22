export interface EventResponse {
    id: number;
    courtId: string;
    startTime: string;
    endTime: string;
    eventName: string;
    description?: string;
    createdAt: string;
}