export const genKeyParams = (obj: Record<string, any>): string => {
    return Object.entries(obj)
        .filter(([_, value]) => typeof value === 'string' || typeof value === 'number')
        .map(([_, value]) => String(value)).sort().join('-');
};