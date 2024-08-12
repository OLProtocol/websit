import useSWRMutation from 'swr/mutation';
import * as request from './request';
import {
  TokenInfoReq,
  AddressReq,
  TokenReq,
  SwrNameListInfo,
  NameListResp,
  SwrTokenBalanceSummaryListInfo,
  TokenBalanceSummaryListResp,
  AddressListReq,
} from './types';



export const useTokenAddressHistory = ({
  address,
  ticker,
  start,
  limit,
}: TokenReq) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `token-address-history-${address}-${ticker}`,
    () =>
      request.getTokenAddressHistory({ start, limit, address, ticker }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useTokenAddressHolders = ({
  address,
  ticker,
  start,
  limit,
}: TokenReq) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `token-address-holders-${address}-${ticker}`,
    () =>
      request.getTokenAddressHolders({ start, limit, address, ticker }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};


export const useTokenHolderList = ({ tick, start, limit }) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `token-holders-${tick}`,
    () => request.getTokenHolderList({ tick, start, limit }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useTokenHistory = ({
  start,
  limit,
  ticker,
}: TokenReq) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `token-history-${ticker}`,
    () => request.getTokenHistory({ start, limit, ticker }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useNsName = ({ name, network }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ns-name-${network}`,
    () => request.getNameInfo({ name }),
  );
  return {
    data,
    error,
    isLoading: isMutating,
    trigger,
    reset,
  };
};


export const useInscriptiontInfo = ({ inscriptionId }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `inscription-mint-details-${inscriptionId}`,
    () => request.getInscriptiontInfo({ inscriptionId }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useOrdInscriptiontInfo = ({ inscriptionId }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `inscription-nft-nftid-${inscriptionId}`,
    () => request.getOrdInscription({ inscriptionId }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useTokenBalanceSummaryList = ({ address }: AddressReq): SwrTokenBalanceSummaryListInfo => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `token-balance-summary-${address}`,
    () => request.getTokenAddressSummaryList({ address }),
  );
  return {
    resp: data as TokenBalanceSummaryListResp,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useNameList = ({ address, start, limit }: AddressListReq): SwrNameListInfo => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `name-list-${address}-${start}-${limit}`,
    () => request.getNameList({ address, start, limit }),
  );
  return {
    resp: data as NameListResp,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
