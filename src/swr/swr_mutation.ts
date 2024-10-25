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


const createSWRMutationHook = <P extends string | Record<string, any>, T>(
  keyPrefix: string,
  param: P,
  fetcher: (param: P) => Promise<T>,
) => {
  const key = `${keyPrefix}-${typeof param === 'string' ? param : genKeyParams(param)}`;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(key, _ => fetcher(param));
  return {
    resp: data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};


export const useAddressMintHistory = (param: MintHistoryReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-address-mint-history`;
  return createSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.address.getMintHistory);
}

export const useAddressUtxoList = (param: UtxoListReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-address-utxo-list`;
  return createSWRMutationHook<UtxoListReq, UtxoListResp>(key, param, indexer.address.getUtxoList);
};


export const useTickHolderList = (param: TickerHolderReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-tick-holder-list`;
  return createSWRMutationHook<TickerHolderReq, TickerHolderResp>(key, param, indexer.tick.getHolderList);
};

export const useTickMintHistory = (param: MintHistoryReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-tick-mint-history-${param.ticker}`;
  return createSWRMutationHook<MintHistoryReq, MintHistoryResp>(key, param, indexer.tick.getMintHistory);
};

export const useInscriptiontInfo = ( inscriptionId: string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-inscription-mint-details-${inscriptionId}`;
  return createSWRMutationHook<string, MintDetailInfoResp>(key, inscriptionId, indexer.mint.getMintDetailInfo);
};

export const useOrdInscriptiontInfo = ( inscriptionId : string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-inscription-nft-nftid-${inscriptionId}`;
  return createSWRMutationHook<string, NftDetailResp>(key, inscriptionId, indexer.nft.getNftDetail);
};

export const useAddressAssetsSummary = (param: AssetsSummaryReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-address-assets-summary-${param.address}-${param.start}-${param.limit}`;
  return createSWRMutationHook<AssetsSummaryReq, AssetsSummaryResp>(key, param, indexer.address.getAssetsSummary);
};

export const useNameList = (param: NameListReq, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-name-list-${param.address}-${param.start}-${param.limit}`;
  return createSWRMutationHook<NameListReq, NameListResp>(key, param, indexer.ns.getNameList);
};

export const useNameInfo = (name: string, keyPrefix: string = 'default') => {
  const key = `${keyPrefix}-name-info-${name}`;
  return createSWRMutationHook<string, NameResp>(key, name, indexer.ns.getName);
};