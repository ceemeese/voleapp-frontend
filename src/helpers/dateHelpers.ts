//Formateo de TimeOnly(string) a objeto date con esas horas de 18:00 a dia+hora
export const parseTimeOnlyToDate = (timeStr: string, baseDate: Date) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours!, minutes!, 0, 0);
    return date;
};

//Formateo de objeto date a "TimeOnly" 18:00
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

//formateo de fecha date o string para formato legible bonito '06 de mayo de 2026'
export const formatFullDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}


