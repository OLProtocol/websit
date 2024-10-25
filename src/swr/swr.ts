import useSWR from 'swr';
import indexer from '@/api/indexer';
import { ListReq, NameStatusListReq, NftStatusListReq, TickerStatusReq } from '@/api/type';
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

export const createCommonUseSwrHook = <T, P>(key: string, reqFunc: (param: P) => Promise<T>, param: P) => {
  return createUseSwrHook<T, P>(key, commonSwrConfig, reqFunc, param);
};

export const creatStaticUseSwrHook = <T, P>(key: string, reqFunc: (param: P) => Promise<T>, param: P) => {
  return createUseSwrHook<T, P>(key, staticSwrConfig, reqFunc, param);
};

export const createUseSwrHook = <T, P>(key: string, swrConf, reqFunc: (param: P) => Promise<T>, param: P) => {
  return () => {
    const { data, error, isLoading, mutate } = useSWR(key, () => reqFunc(param), swrConf);
    return {
      resp: data,
      error,
      isLoading,
      mutate
    };
  };
};

// common 
export const useFtList = (param: ListReq) => {
  const key = `ft-List-${param.start}-${param.limit}`;
  return createCommonUseSwrHook(key, indexer.tick.getStatusList, param)();
};

export const useNameStatusList = (param: NameStatusListReq) => {
  const key = `name-status-List-${param.start}-${param.limit}`;
  return createCommonUseSwrHook(key, indexer.ns.getNameStatusList, param)();
};

export const useNftList = (param: NftStatusListReq) => {
  const key = `nft-List-${param.start}-${param.limit}`;
  return createCommonUseSwrHook(key, indexer.nft.getNftStatusList, param)();
};

export const useGetUtxo = (utxo: string) => {
  const key = `utxo-assets-${utxo}`;
  return createCommonUseSwrHook(key, indexer.utxo.getAssetList, utxo)();
};

export const useTickerStatus = (param: TickerStatusReq) => {
  const key = `token-info-${param.ticker}`;
  return createCommonUseSwrHook(key, indexer.tick.getStatus, param)();
};

export const useIndexHealth = () => {
  const { resp, error, isLoading } = createCommonUseSwrHook(`health`, indexer.common.getHealth, null)();
  return {
    resp,
    error,
    isLoading,
  };
}

// static
export const useIndexHeight = () => {
  return creatStaticUseSwrHook(`indexHeight`, indexer.common.getBestHeight, {})();
}

export const useBtcFeeRate = () => {
  const { network } = useReactWalletStore(state => state);
  return creatStaticUseSwrHook(`fee-${network}`, fetchChainFeeRate, network)();
}

export const useSatTypes = () => {
  return creatStaticUseSwrHook(`sat-types`, indexer.common.getSatributeList, {})();
}

export const useAppVersion = () => {
  return creatStaticUseSwrHook(`app-version`, indexer.common.getAppVersion, {})();
}
