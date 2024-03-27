export const getCachedData = (key: string) => {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
};

// 缓存数据到localStorage
export const cacheData = (key: string, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};