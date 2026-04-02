export interface Schedule {
    id: number, 
    clubId: string,
    dayOfWeek: DayOfWeek,
    openingTime: Date,
    closingTime: Date,
    isClosed: boolean,
}

export interface DayOfWeek {
    id: number;
    day: string;
}