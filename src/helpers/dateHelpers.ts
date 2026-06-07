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

//calcular duracion reserva
export const calculateDuration = (start: string, end: string): number => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2! * 60 + m2!) - (h1! * 60 + m1!);
};


export const MONTHS_OPTIONS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

const currentYearGlobal = new Date().getFullYear();
export const YEARS_OPTIONS = [
  { value: currentYearGlobal, label: String(currentYearGlobal) },
  { value: currentYearGlobal - 1, label: String(currentYearGlobal - 1) },
  { value: currentYearGlobal - 2, label: String(currentYearGlobal - 2) }
];

