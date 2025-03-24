import useSWR from 'swr';
import indexer from '@/api/indexer';
import { ListReq, NameStatusListReq, NftStatusListReq, RuneListReq, RuneReq, TickerStatusReq } from '@/api/type';
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
      data,
      error,
      isLoading,
      mutate
    };
  };
};

// common 
export const useTickerStatusList = (param: ListReq) => {
  const key = `ticker-status-list-${param.start}-${param.limit}`;
  const resp = createCommonUseSwrHook(key, indexer.tick.getStatusList, param)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
};

export const useNameStatusList = (param: NameStatusListReq) => {
  const key = `name-status-list-${param.start}-${param.limit}`;
  const resp = createCommonUseSwrHook(key, indexer.ns.getNameStatusList, param)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
};

export const useRuneList = (param: RuneListReq) => {
  const key = `rune-list-${param.start}-${param.limit}`;
  const resp = createCommonUseSwrHook(key, indexer.runes.getRuneList, param)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
    total: resp.data?.total
  }
};

export const useRune = (param: RuneReq | undefined) => {
  if (!param) return {
    data: undefined,
    isLoading: false,
    error: null,
    mutate: () => { },
  };
  const key = `rune-${param.Protocol}-${param.Type}-${param.Ticker}`;
  const resp = createCommonUseSwrHook(key, indexer.runes.getRune, param)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
};

export const useNftList = (param: NftStatusListReq) => {
  const key = `nft-list-${param.start}-${param.limit}`;
  const resp = createCommonUseSwrHook(key, indexer.nft.getNftStatusList, param)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
};

export const useGetAssetList = (utxo: string) => {
  const key = `utxo-assets-${utxo}`;
  const resp = createCommonUseSwrHook(key, indexer.utxo.getAssetList, utxo)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
};

export const useTickerStatus = (param: TickerStatusReq) => {
  if (!param.ticker) return {
    data: undefined,
    isLoading: false,
    error: null,
    mutate: () => { },
  };
  const key = `token-info-${param.ticker}`;
  const resp = createCommonUseSwrHook(key, indexer.tick.getStatus, param)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
};

export const useIndexHealth = () => {
  const resp = createCommonUseSwrHook(`health`, indexer.common.getHealth, undefined)();
  return {
    data: resp.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
}

// static
export const useIndexHeight = () => {
  const resp = creatStaticUseSwrHook(`indexHeight`, indexer.common.getBestHeight, undefined)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
}

export const useBtcFeeRate = () => {
  const { network } = useReactWalletStore(state => state);
  const resp = creatStaticUseSwrHook(`fee-${network}`, fetchChainFeeRate, network)();
  return {
    data: resp.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
}

export const useSatTypes = () => {
  const resp = creatStaticUseSwrHook(`sat-types`, indexer.common.getSatributeList, undefined)();
  return {
    data: resp.data?.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
}

export const useAppVersion = () => {
  const resp = creatStaticUseSwrHook(`app-version`, indexer.common.getAppVersion, undefined)();
  return {
    data: resp.data,
    isLoading: resp.isLoading,
    error: resp.error,
    mutate: resp.mutate,
  }
}
