import useSWRMutation from "swr/mutation";
import indexer from '@/api/indexer';
import { genKeyParams } from './util';
import {
  MintHistoryReq,
  UtxoListReq,
  TickerHolderReq,
  MintHistoryResp,
  UtxoListResp,
  AddressAssetsSummaryReq,
  TickerHolderResp,
  NameListReq,
  MintDetailInfoResp,
  NftDetailResp,
  AddressAssetsSummaryResp,
  NameListResp,
  NameResp,
  IndexerLayer,
  TickerHolderRespV3,
  MintHistoryRespV3,
} from '@/api/type';
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/api/indexer/common";


const useSWRMutationHook = <P extends string | Record<string, any>, T>(
  keyPrefix: string,
  param: P,
  fetcher: (param: P, IndexerLayer) => Promise<T>,
  indexerLayer: IndexerLayer = IndexerLayer.Base
) => {
  const key = `${keyPrefix}-${typeof param === 'string' ? param : genKeyParams(param)}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => fetcher(param, indexerLayer));
  return {
    data: data as T,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useAddressMintHistory = (param: MintHistoryReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-address-mint-history`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.address.getMintHistory, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
}

export const useAddressUtxoList = (param: UtxoListReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-address-utxo-list`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<UtxoListReq, UtxoListResp>(key, param, indexer.address.getUtxoList, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};


export const useTickHolderList = (param: TickerHolderReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-tick-holder-list`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<TickerHolderReq, TickerHolderResp>(key, param, indexer.tick.getHolderList, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useTickMintHistory = (param: MintHistoryReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-tick-mint-history-${param.ticker}`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.tick.getMintHistory, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useInscriptiontInfo = ( inscriptionId: string, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-inscription-mint-details-${inscriptionId}`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<string, MintDetailInfoResp>(key, inscriptionId, indexer.mint.getMintDetailInfo, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useOrdInscriptiontInfo = ( inscriptionId : string, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-inscription-nft-nftid-${inscriptionId}`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<string, NftDetailResp>(key, inscriptionId, indexer.nft.getNftDetail, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useAddressAssetsSummary = (param: AddressAssetsSummaryReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-address-assets-summary-${param.address}-${param.start}-${param.limit}`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<AddressAssetsSummaryReq, AddressAssetsSummaryResp>(key, param, indexer.address.getAssetsSummary, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useNameList = (param: NameListReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer) => {
  const key = `${keyPrefix}-name-list-${param.address}-${param.start}-${param.limit}`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<NameListReq, NameListResp>(key, param, indexer.ns.getNameList, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useNameInfo = (name: string, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-name-info-${name}`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<string, NameResp>(key, name, indexer.ns.getName, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

// v3
export const useTickHolderListV3 = (param: TickerHolderReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-tick-holder-list-v3`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<TickerHolderReq, TickerHolderRespV3>(key, param, indexer.tick.getHolderListV3, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};

export const useTickMintHistoryV3 = (param: MintHistoryReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-tick-mint-history-${param.ticker}-v3`;
  const { data, trigger, reset, isLoading, error } = useSWRMutationHook<MintHistoryReq, MintHistoryRespV3>(key, param, indexer.tick.getMintHistoryV3, indexerLayer);
  return {
    data: data?.data,
    trigger,
    reset,
    isLoading,
    error,
  }
};