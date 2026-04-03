export interface PutEvent {
    startTime: Date;
    endTime: Date;
    eventName: string;
    description?: string;
}