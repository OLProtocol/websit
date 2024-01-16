import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
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

const { VITE_API_HOST } = import.meta.env;
interface Ord2ListStatusParams {
  start: number;
  limit: number;
  sort?: string;
  ticker_hex?: string;
  complete?: string;
}
export const generateUrl = (url: string) => {
  return `${VITE_API_HOST}/ordx/${url}`;
};
export const useOrd2Status = ({ start, limit }: Ord2ListStatusParams) => {
  console.log(start);
  console.log(limit);
  const { data, error, isLoading } = useSWR(
    generateUrl(`v1/indexer/ordx/status?start=${start}&limit=${limit}`),
    fetcher,
  );
  return {
    data,
    error,
    isLoading,
  };
};

interface Ord2InfoParams {
  tick?: string;
}
export const useOrd2Info = ({ tick }: Ord2InfoParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    generateUrl(`v1/indexer/ordx/${tick}/info`),
    fetcher,
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
interface OrdXSummaryParams {
  address?: string;
}
export const useOrdXSummary = ({ address }: OrdXSummaryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    generateUrl(`query-v4/address/${address}/ordx/summary
    `),
    fetcher,
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
interface OrdXHistoryParams {
  address?: string;
  ticker?: string;
}
export const useOrdXHistory = ({ address, ticker }: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    generateUrl(`query-v4/address/${address}/ordx/${ticker}/summary
    `),
    fetcher,
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const useAvailableUtxos = ({ address, ticker }: OrdXHistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    generateUrl(`query-v4/address/${address}/ordx/${ticker}/getAvailableUtxo
    `),
    fetcher,
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};
export const requstAvailableUtxos = async ({
  address,
  ticker,
}: OrdXHistoryParams) => {
  const { data } = await axios.get(
    generateUrl(`query-v4/address/${address}/ordx/${ticker}/getAvailableUtxo
  `),
  );
  return data;
};
export const requstOrd2Info = async ({ tick }: Ord2InfoParams) => {
  const { data } = await axios.get(generateUrl(`v1/indexer/ordx/${tick}/info`));
  return data;
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
