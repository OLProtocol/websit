import useSWR from 'swr';
import * as blockStream from './blockStream';
import useSWRMutation from 'swr/mutation';
import * as request from './request';
import {
  Ord2ListStatusParams,
  Ord2InfoParams,
  OrdXSummaryParams,
  OrdXHistoryParams,
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
// export const useOrd2Status = ({
//   start,
//   limit,
//   network,
// }: Ord2ListStatusParams) => {
//   const { data, error, isLoading } = useSWR(
//     `ord2-status-${start}-${limit}-${network}`,
//     () => request.getOrdxStatusList({ start, limit, network }),
//   );
//   return {
//     data,
//     error,
//     isLoading,
//   };
// };

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

export const useSatTypes = ({ network }: any) => {
  const { data, error, isLoading } = useSWR(
    `ordx-utxo-satstype-${network}`,
    () => request.getSatTypes({ network }),
    {
      keepPreviousData: true,
    },
  );
  return {
    data,
    error,
    isLoading: isLoading,
  };
};
export const useGetUtxo = ({ network, utxo }: any) => {
  const { data, error, isLoading } = useSWR(
    `ordx-utxo-${utxo}-${network}`,
    () => {
      return request.getUtxo({ network, utxo })
    },
    {
      keepPreviousData: true,
    },
  );
  return {
    data,
    error,
    isLoading: isLoading,
  };
};
export const useSeedByUtxo = ({ utxo, network }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-seed-${utxo}-${network}`,
    () => request.getSeedByUtxo({ network, utxo }),
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
export const useGetAssetByUtxo = ({ network, utxo }: any) => {
  const { data, error, isLoading } = useSWR(
    `ordx-utxo-utxo-${network}`,
    () => request.getAssetByUtxo({ network, utxo }),
    {
      keepPreviousData: true,
    },
  );
  return {
    data,
    error,
    isLoading: isLoading,
  };
};
export const useExoticUtxo = ({ network, utxo }: any) => {
  console.log('useExoticUtxo');
  const { data, error, isMutating, trigger } = useSWRMutation(
    `ordx-utxo-${utxo}-${network}`,
    () => request.exoticUtxo({ network, utxo }),
  );
  return {
    data,
    error,
    isLoading: isMutating,
    trigger,
  };
};
export const useInscriptiontInfo = ({ inscriptionId, network }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-inscription-${inscriptionId}-${network}`,
    () => request.getInscriptiontInfo({ inscriptionId, network }),
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
export const useOrdxTickHolders = ({ tick, network, start, limit }) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ordx-history-${tick}-${network}`,
    () => request.getOrdxTickHolders({ tick, network, start, limit }),
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

export const useBtcHeight = (network: string) => {
  const { data, error, isLoading } = useSWR(
    `height-${network}`,
    () => request.getBestHeight({ network }),
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
export const useOrdNftList = ({ network, start, limit }: any) => {
  const { data, error, isLoading } = useSWR(
    `ns-list-${network}-${start}-${limit}`,
    () => request.getOrdNftList({ network, start, limit }),
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
export const useNsList = ({ network, start, limit }: any) => {
  const { data, error, isLoading } = useSWR(
    `ns-list-${network}-${start}-${limit}`,
    () => request.getNsList({ network, start, limit }),
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
export const useNsListByAddress = ({ address, network, start, limit }: any) => {
  const { data, error, isLoading } = useSWR(
    `ns-list-${address}-${network}-${start}-${limit}`,
    () => request.getNsListByAddress({ network, address, start, limit }),
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
export const useNsName = ({ name, network }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ns-name-${network}`,
    () => request.getNsName({ name, network }),
  );
  return {
    data,
    error,
    isLoading: isMutating,
    trigger,
    reset,
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

export const useOrdInscriptiontInfo = ({ inscriptionId, network }: any) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ord-inscription-${inscriptionId}-${network}`,
    () => request.getOrdInscription({ inscriptionId, network }),
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
