import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const commonSwrConfig = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnMount: true,
    revalidateIfStale: true,
    keepPreviousData: true,
}

const staticSwrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    refreshInterval: 60000,
    revalidateOnMount: false,
    revalidateIfStale: false,
    keepPreviousData: true,
}

const fullSwrConfig = {
    revalidateOnFocus: false, // default true 聚焦时重新获取数据
    revalidateOnReconnect: false, // default true 网络重新连接时重新获取数据
    dedupingInterval: 60000, // default 2000 N秒内不会重复请求
    refreshInterval: 60000, // default 0 自动重新获取数据
    revalidateOnMount: false, // default true 组件挂载时是否重新获取数据
    revalidateIfStale: false,// default true 如果数据过期，组件挂载时重新获取数据
    keepPreviousData: true, // default false 重新获取数据时保留之前的数据

    shouldRetryOnError: true,// default true 请求失败时重试
    errorRetryInterval: 5000,// default 5000 失败请求重试间隔
    errorRetryCount: Infinity,// default Infinity 败请求最大重试次数
    focusThrottleInterval: 5000, // default 5000 聚焦重新获取数据的节流时间间隔为5秒
    loadingTimeout: 3000, // default 3000 数据加载超时时间为3秒
}

export const getCommonUseSwrFunc = (key: string, reqFunc: (any) => Promise<any>, params) => {
    return () => {
        const { data, error, isLoading } = useSWR(key, () => reqFunc(params), commonSwrConfig);
        return {
            data,
            error,
            isLoading,
        };
    }
};

export const getStaticUseSwrFunc = (key: string, reqFunc: (any) => Promise<any>, params) => {
    return () => {
        const { data, error, isLoading } = useSWR(key, () => reqFunc(params), staticSwrConfig);
        return {
            data,
            error,
            isLoading,
        };
    }
};
