export interface Schedule {
    id: number, 
    clubId: string,
    dayOfWeek: DayOfWeek,
    openingTime: string,
    closingTime: string,
    isClosed: boolean,
}

export interface DayOfWeek {
    id: number;
    name: string;
}