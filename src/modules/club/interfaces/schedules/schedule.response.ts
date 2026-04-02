export interface ScheduleResponse {
    id: number, 
    clubId: string,
    dayOfWeek: DayOfWeekResponse,
    openingTime: Date,
    closingTime: Date,
    isClosed: boolean,
}

export interface DayOfWeekResponse {
    id: number;
    day: string;
}