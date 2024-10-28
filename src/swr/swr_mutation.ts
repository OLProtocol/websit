import useSWRMutation from "swr/mutation";
import indexer from '@/api/indexer';
import { genKeyParams } from './util';
import {
  MintHistoryReq,
  UtxoListReq,
  AddressListReq,
  TickerHolderReq,
  MintHistoryResp,
  UtxoListResp,
  AssetsSummaryReq,
  TickerHolderResp,
  NameListReq,
  IndexerLayer,
} from '@/api/type';


const createSWRMutationHook = <P extends Record<string, any>, T>(
  keyPrefix: string,
  param: P,
  fetcher: (param: P, IndexerLayer) => Promise<T>,
  indexerLayer: IndexerLayer = IndexerLayer.Base
) => {
  const key = `${keyPrefix}-${genKeyParams(param)}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => fetcher(param, indexerLayer));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};


export const useAddressMintHistory = (param: MintHistoryReq, prefix: string = 'default') => {
  const key = `${prefix}-address-mint-history`;
  return createSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.address.getMintHistory);
}

export const useAddressUtxoList = (param: UtxoListReq, prefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${prefix}-address-utxo-list`;
  return createSWRMutationHook<UtxoListReq, UtxoListResp>(key, param, indexer.address.getUtxoList, indexerLayer);
};

export const useTickHolderList = (param: TickerHolderReq, prefix: string = 'default') => {
  const key = `${prefix}-tick-holder-list`;
  return createSWRMutationHook<TickerHolderReq, TickerHolderResp>(key, param, indexer.tick.getHolderList);
};

export const useTickMintHistory = (param: MintHistoryReq, keyPrefix: string = '') => {
  const key = `${keyPrefix}-tick-mint-history-${param.ticker}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => indexer.tick.getMintHistory(param));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useInscriptiontInfo = ({ inscriptionId }: any) => {
  const key = `inscription-mint-details-${inscriptionId}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => indexer.mint.getMintDetailInfo(inscriptionId));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useOrdInscriptiontInfo = ({ inscriptionId }: any) => {
  const key = `inscription-nft-nftid-${inscriptionId}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => indexer.nft.getOrdInscription( inscriptionId));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useAddressAssetsSummary = (param: AssetsSummaryReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-address-assets-summary-${param.address}-${param.start}-${param.limit}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => indexer.address.getAssetsSummary(param, indexerLayer));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useNameList = (param: NameListReq, keyPrefix: string = 'default', indexerLayer: IndexerLayer = IndexerLayer.Base) => {
  const key = `${keyPrefix}-name-list-${param.address}-${param.start}-${param.limit}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => indexer.ns.getNameList(param, indexerLayer));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useNameInfo = (name: string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-name-info-${name}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => indexer.ns.getName(name));
  return {
    resp: data,
    error,
    isLoading: isMutating,
    trigger,
    reset,
  };
};