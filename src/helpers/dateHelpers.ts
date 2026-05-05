//Formateo de TimeOnly(string) a objeto date con esas horas
export const parseTimeOnlyToDate = (timeStr: string, baseDate: Date) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours!, minutes!, 0, 0);
    return date;
};

//Formateo de objeto date a TimeOnly 
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });
};

//Formateo de Date a formato YYY-MM-DD (DateOnly)
export const toDateOnlyString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


