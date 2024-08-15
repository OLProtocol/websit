const memoryCache: { [key: string]: any } = {};

export const getCachedData = (key: string) => {
    return memoryCache[key] || null;
};

export const setCacheData = (key: string, data: any) => {
    memoryCache[key] = data;
};