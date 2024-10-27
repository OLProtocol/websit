import useSWRMutation from "swr/mutation";
import indexer from '@/api/indexer';
import { genKeyParams } from './util';
import {
  MintHistoryReq,
  UtxoListReq,
  TickerHolderReq,
  MintHistoryResp,
  UtxoListResp,
  AssetsSummaryReq,
  TickerHolderResp,
  NameListReq,
  MintDetailInfoResp,
  NftDetailResp,
  AssetsSummaryResp,
  NameListResp,
  NameResp,
} from '@/api/type';
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/api/indexer/common";


const createSWRMutationHook = <P extends string | Record<string, any>, T>(
  keyPrefix: string,
  param: P,
  fetcher: (param: P) => Promise<T>,
) => {
  const key = `${keyPrefix}-${typeof param === 'string' ? param : genKeyParams(param)}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => fetcher(param));
  return {
    data: data as T,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useAddressMintHistory = (param: MintHistoryReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-address-mint-history`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.address.getMintHistory);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
}

export const useAddressUtxoList = (param: UtxoListReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-address-utxo-list`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<UtxoListReq, UtxoListResp>(key, param, indexer.address.getUtxoList);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};


export const useTickHolderList = (param: TickerHolderReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-tick-holder-list`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<TickerHolderReq, TickerHolderResp>(key, param, indexer.tick.getHolderList);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useTickMintHistory = (param: MintHistoryReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-tick-mint-history-${param.ticker}`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.tick.getMintHistory);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useInscriptiontInfo = ( inscriptionId: string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-inscription-mint-details-${inscriptionId}`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<string, MintDetailInfoResp>(key, inscriptionId, indexer.mint.getMintDetailInfo);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useOrdInscriptiontInfo = ( inscriptionId : string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-inscription-nft-nftid-${inscriptionId}`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<string, NftDetailResp>(key, inscriptionId, indexer.nft.getNftDetail);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useAddressAssetsSummary = (param: AssetsSummaryReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-address-assets-summary-${param.address}-${param.start}-${param.limit}`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<AssetsSummaryReq, AssetsSummaryResp>(key, param, indexer.address.getAssetsSummary);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useNameList = (param: NameListReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-name-list-${param.address}-${param.start}-${param.limit}`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<NameListReq, NameListResp>(key, param, indexer.ns.getNameList);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useNameInfo = (name: string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-name-info-${name}`;
  const { data, trigger, reset, isLoading, error } = createSWRMutationHook<string, NameResp>(key, name, indexer.ns.getName);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};