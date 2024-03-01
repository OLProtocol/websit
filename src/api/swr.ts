import useSWR from 'swr';
import * as blockStream from './blockStream';
import useSWRMutation from 'swr/mutation';
import * as request from './request';
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

export const useAppVersion = () => {
  const { data, error, isLoading } = useSWR(
    `app-version`,
    () => request.getAppVersion(),
    {
      refreshInterval: 1000 * 60 * 2,
    },
  );
  return {
    data,
    error,
    isLoading,
  };
};
export const useOrd2Status = ({
  start,
  limit,
  network,
}: Ord2ListStatusParams) => {
  const { data, error, isLoading } = useSWR(
    `ord2-status-${start}-${limit}-${network}`,
    () => request.getOrdxStatusList({ start, limit, network }),
  );
  return {
    data,
    error,
    isLoading,
  };
};

export const useOrdxInfo = ({ tick, network }: Ord2InfoParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ord2-info-${tick}-${network}`,
    () => request.getOrdxInfo({ tick, network }),
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
    () => request.getOrdxSummary({ address, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useOrdxAddressHistory = ({
  address,
  ticker,
  network,
  start,
  limit,
}: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${address}-${ticker}`,
    () =>
      request.getOrdxAddressHistory({ start, limit, address, ticker, network }),
  );
  1;
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useOrdxAddressHolders = ({
  address,
  ticker,
  network,
  start,
  limit,
}: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${address}-${ticker}`,
    () =>
      request.getOrdxAddressHolders({ start, limit, address, ticker, network }),
  );
  1;
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useOrdxTickHolders = ({ tick, network }: Ord2InfoParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${tick}-${network}`,
    () => request.getOrdxTickHolders({ tick, network }),
  );
  1;
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useOrdxTickHistory = ({
  start,
  limit,
  ticker,
  network,
}: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${ticker}`,
    () => request.getOrdxTickHistory({ start, limit, ticker, network }),
  );
  1;
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useAvailableUtxos = ({ address, ticker, network }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${address}-${ticker}`,
    () => request.getAvailableUtxos({ address, ticker, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useBtcHeight = (network: string) => {
  const { data, error, isLoading } = useSWR(
    `height-${network}`,
    () => blockStream.getTipBlockHeight({ network }),
    {
      refreshInterval: 1000 * 60 * 5,
    },
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
