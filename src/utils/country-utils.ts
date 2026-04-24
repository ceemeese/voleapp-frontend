export const COUNTRY_FLAGS_DATA: Record<string, { name: string, flag: string}> = {
    'ES': { name: 'España', flag: '🇪🇸'},
    'FR': { name: 'Francia', flag: '🇫🇷'},
    'IT': { name: 'Italia', flag: '🇮🇹'},
    'MX': { name: 'Mexico', flag: '🇲🇽'},
    'AR': { name: 'Argentina', flag: '🇦🇷'},
    'US': { name: 'EE.UU', flag: '🇺🇸'},
    'EN': { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}
};


export const getCountryFlag = (isoCode: string | undefined): string => {
    if (!isoCode) return '🌍';
    return COUNTRY_FLAGS_DATA[isoCode.toUpperCase()]?.flag || '🌍';
};

export const getCountryName = (isoCode: string | undefined): string => {
    if (!isoCode) return 'Desconocido';
    return COUNTRY_FLAGS_DATA[isoCode.toUpperCase()]?.name || isoCode;
};

