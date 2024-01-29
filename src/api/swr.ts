import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import * as requst from './request';
import {
  Ord2ListStatusParams,
  Ord2InfoParams,
  OrdXSummaryParams,
  OrdXHistoryParams,
  OrdXHistoryDetailParams,
} from './types';

import { fetchTipHeight, fetchChainFeeRate } from '@/lib/utils';
const fetcher = (args) =>
  fetch(args)
    .then((res) => res.json())
    .then(({ code, msg, data }) => {
      if (code === 0) {
        return data;
      } else {
        console.log('error: ' + msg);
      }
    });

export const useOrd2Status = ({
  start,
  limit,
  network,
}: Ord2ListStatusParams) => {
  const { data, error, isLoading } = useSWR(
    `ord2-status-${start}-${limit}-${network}`,
    () =>
    requst.getOrdxStatusList({ start, limit, network }),
  );
  return {
    data,
    error,
    isLoading,
  };
};

export const useOrdxInfo = ({ tick, network }: Ord2InfoParams) => {
  const { data, error, isMutating, trigger, reset  } = useSWRMutation(
    `ord2-info-${tick}-${network}`,
    () => requst.getOrdxInfo({ tick, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useOrdxSummary = ({ address, network }: OrdXSummaryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-summary-${address}`,
    () => requst.getOrdxSummary({ address, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useOrdXHistory = ({ address, ticker, network }: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${address}-${ticker}`,
    () => requst.getOrdxHistory({ address, ticker, network }),
  );1
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useAvailableUtxos = ({ address, ticker, network }: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${address}-${ticker}`,
    () => requst.getAvailableUtxos({ address, ticker, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};


export const useBtcHeight = (network: 'testnet' | 'main') => {
  const { data, error, isLoading } = useSWR(`height-${network}`, () =>
    fetchTipHeight(network),
  );
  return {
    data,
    error,
    isLoading,
  };
};
export const useBtcFeeRate = (network: 'testnet' | 'main') => {
  const { data, error, isLoading } = useSWR(`fee-${network}`, () =>
    fetchChainFeeRate(network),
  );
  return {
    data,
    error,
    isLoading,
  };
};
