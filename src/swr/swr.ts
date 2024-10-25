import useSWR from 'swr';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import indexer from '@/api/indexer';
import { ListReq, NameStatusListReq, TickerStatusReq } from '@/api/type';
import { fetchChainFeeRate } from '@/lib/utils';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';


// useSWR
const commonSwrConfig = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  refreshInterval: 0,
  revalidateOnMount: true,
  revalidateIfStale: true,
  keepPreviousData: true,
}

const staticSwrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 5000,
  refreshInterval: 30000,
  revalidateOnMount: false,
  revalidateIfStale: false,
  keepPreviousData: true,
}

const fullSwrConfig = {
  revalidateOnFocus: false, // default true 聚焦时重新获取数据
  revalidateOnReconnect: false, // default true 网络重新连接时重新获取数据
  dedupingInterval: 60000, // default 2000 N秒内不会重复请求
  refreshInterval: 30000, // default 0 自动重新获取数据
  revalidateOnMount: false, // default true 组件挂载时是否重新获取数据
  revalidateIfStale: false,// default true 如果数据过期，组件挂载时重新获取数据
  keepPreviousData: true, // default false 重新获取数据时保留之前的数据

  shouldRetryOnError: true,// default true 请求失败时重试
  errorRetryInterval: 5000,// default 5000 失败请求重试间隔
  errorRetryCount: Infinity,// default Infinity 败请求最大重试次数
  focusThrottleInterval: 5000, // default 5000 聚焦重新获取数据的节流时间间隔为5秒
  loadingTimeout: 3000, // default 3000 数据加载超时时间为3秒
}

export const getCommonUseSwrFunc = <T, P>(key: string, reqFunc: (param: P) => Promise<T>, param: P) => {
  return getUseSwrFunc<T, P>(key, commonSwrConfig, reqFunc, param);
};

export const getStaticUseSwrFunc = <T, P>(key: string, reqFunc: (param: P) => Promise<T>, param: P) => {
  return getUseSwrFunc<T, P>(key, staticSwrConfig, reqFunc, param);
};

export const getUseSwrFunc = <T, P>(key: string, swrConf, reqFunc: (param: P) => Promise<T>, param: P) => {
  return () => {
    const { data, error, isLoading, mutate } = useSWR(key, () => reqFunc(param), swrConf);
    // const lastFetchTime = localStorage.getItem(`swr-lastFetchTime_${key}`);
    // const currentTime = Date.now();
    // const lastFetchTimestamp = lastFetchTime ? parseInt(lastFetchTime, 10) : 0;

    // useEffect(() => {
    //   if ((data && (currentTime - lastFetchTimestamp > 60 * 1000)) || !data) {
    //     mutate();
    //   }
    // }, [currentTime, lastFetchTimestamp]);

    // if (data) {
    //   localStorage.setItem(`swr-lastFetchTime_${key}`, currentTime.toString());
    // }

    return {
      data,
      error,
      isLoading,
    };
  };
};

// common 
export const useFtList = (param: ListReq) => {
  return getCommonUseSwrFunc(`ft-List-${param.start}-${param.limit}`, indexer.tick.getStatusList, param)();
};

export const useNameStatusList = (param: NameStatusListReq) => {
  const [debouncedStart] = useDebounce(param.start, 300);
  const [debouncedLimit] = useDebounce(param.limit, 300);
  const key = useMemo(() => `name-status-List-${debouncedStart}-${debouncedLimit}`, [debouncedStart, debouncedLimit]);
  const debouncedParam = useMemo(() => ({
    ...param,
    start: debouncedStart,
    limit: debouncedLimit
  }), [param, debouncedStart, debouncedLimit]);
  return getCommonUseSwrFunc(key, indexer.ns.getNameStatusList, debouncedParam)();
  // return getCommonUseSwrFunc(`name-status-List-${param.start}-${param.limit}`, indexer.ns.getNameStatusList, param)();
};

export const useNftList = (param: ListReq) => {
  return getCommonUseSwrFunc(`nft-List-${param.start}-${param.limit}`, indexer.nft.getNftStatusList, param)();
};

export const useGetUtxo = ({ utxo }: any) => {
  return getCommonUseSwrFunc(`utxo-assets-${utxo}`, indexer.utxo.getAssetList, utxo)();
};

export const useTickerStatus = ({ ticker }: TickerStatusReq) => {
  return getCommonUseSwrFunc(`token-info-${ticker}`, indexer.tick.getStatus, { ticker })();
};

export const useIndexHealth = () => {
  const { data, error, isLoading } = getCommonUseSwrFunc(`health`, indexer.common.getHealth, null)();
  return {
    data,
    error,
    isLoading,
  };
}

// static
export const useIndexHeight = () => {
  return getStaticUseSwrFunc(`indexHeight`, indexer.common.getBestHeight, {})();
}

export const useBtcFeeRate = () => {
  const { network } = useReactWalletStore(state => state);
  return getStaticUseSwrFunc(`fee-${network}`, fetchChainFeeRate, network)();
}

export const useSatTypes = () => {
  return getStaticUseSwrFunc(`sat-types`, indexer.common.getSatributeList, {})();
}

export const useAppVersion = () => {
  return getStaticUseSwrFunc(`app-version`, indexer.common.getAppVersion, {})();
}
