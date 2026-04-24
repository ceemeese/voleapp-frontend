export interface ScheduleResponse {
    id: number, 
    clubId: string,
    dayOfWeek: DayOfWeekResponse,
    openingTime: string,
    closingTime: string,
    isClosed: boolean,
}

export interface DayOfWeekResponse {
    id: number;
    name: string;
}