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
  console.log(address, ticker)
  // const { data } = await axios.get(
  //   generateUrl(`query-v4/address/${address}/ordx/${ticker}/getAvailableUtxo
  // `),
  // );
  return {
    code: 0,
    msg: 'ok',
    data: {
      detail: [
        {
          txid: '181fd31a0f6cec71daa7c2fa9b4724e56d5bb10fc1d66032aca752156932101f',
          vout: 0,
          status: {
            confirmed: true,
            block_height: 2571586,
            block_hash:
              '000000000000000f6f5c3ff6a00c367664720e2da44a531593533ba58e4b2829',
            block_time: 1704700219,
          },
          value: 546,
        },
        {
          txid: '471d94878b70a3986ca4b8d12bffa5efc35c6ab23ba82a6590b4dc15be250cd2',
          vout: 0,
          status: {
            confirmed: true,
            block_height: 2572289,
            block_hash:
              '000000000000004307042812869f65e4143c3b61cb2af4b990564aea041ad8a1',
            block_time: 1704943907,
          },
          value: 546,
        },
        {
          txid: 'a5df78e71c11b32d44f6f4aafefe8f0bc370af360fa46817cc26d4c2127f0a77',
          vout: 0,
          status: {
            confirmed: true,
            block_height: 2572289,
            block_hash:
              '000000000000004307042812869f65e4143c3b61cb2af4b990564aea041ad8a1',
            block_time: 1704943907,
          },
          value: 546,
        },
        {
          txid: 'b0214dc8e6a4c16edfc587a989e1adf2cca424706ea07ad545f339ffbe59ca9a',
          vout: 0,
          status: {
            confirmed: true,
            block_height: 2572488,
            block_hash:
              '0000000000000024246aaedfc51b57d73f647e0e332501f45ebd54276a67ecee',
            block_time: 1705030473,
          },
          value: 546,
        },
        {
          txid: 'c21b429bec03ed0cd0d54c3683034f07f52d251a8a97ee5c96a659bd6dbf1886',
          vout: 1,
          status: {
            confirmed: true,
            block_height: 2572488,
            block_hash:
              '0000000000000024246aaedfc51b57d73f647e0e332501f45ebd54276a67ecee',
            block_time: 1705030473,
          },
          value: 84421,
        },
        {
          txid: '00a80c3342451c3ab73a9e19743a8d50467555751cb8730077942eb30c1cc19d',
          vout: 0,
          status: {
            confirmed: true,
            block_height: 2572291,
            block_hash:
              '0000000000000016fb3088c4769228c12ffd531d4ef5812aca0ce8e23716defe',
            block_time: 1704944224,
          },
          value: 546,
        },
      ],
      amount: 10000,
    },
  };
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
