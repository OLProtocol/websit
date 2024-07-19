import useSWR from 'swr';
import * as blockStream from './blockStream';
import useSWRMutation from 'swr/mutation';
import * as request from './request';
import {
  Sat20ListStatusParams,
  Sat20InfoParams,
  Sat20SummaryParams,
  Sat20HistoryParams,
} from './types';

import { fetchTipHeight, fetchChainFeeRate } from '@/lib/utils';
import { useMemo } from 'react';
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

export const useSat20Info = ({ tick, network }: Sat20InfoParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `ord2-info-${tick}-${network}`,
    () => request.getSat20Info({ tick, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useSat20Summary = ({ address, network }: Sat20SummaryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `sat20-summary-${address}`,
    () => request.getSat20Summary({ address, network }),
  );
  return {
    data,
    trigger,
    reset,
    error,
    isLoading: isMutating,
  };
};

export const useSat20AddressHistory = ({
  address,
  ticker,
  network,
  start,
  limit,
}: Sat20HistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `sat20-history-${address}-${ticker}`,
    () =>
      request.getSat20AddressHistory({ start, limit, address, ticker, network }),
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
export const useSat20AddressHolders = ({
  address,
  ticker,
  network,
  start,
  limit,
}: Sat20HistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `sat20-history-${address}-${ticker}`,
    () =>
      request.getSat20AddressHolders({ start, limit, address, ticker, network }),
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
    `sat20-utxo-satstype-${network}`,
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
    `sat20-utxo-${utxo}-${network}`,
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
    `sat20-seed-${utxo}-${network}`,
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
    `sat20-utxo-utxo-${network}`,
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
    `sat20-utxo-${utxo}-${network}`,
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
    `sat20-inscription-${inscriptionId}-${network}`,
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
export const useSat20TickHolders = ({ tick, network, start, limit }) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `sat20-history-${tick}-${network}`,
    () => request.getSat20TickHolders({ tick, network, start, limit }),
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
export const useSat20TickHistory = ({
  start,
  limit,
  ticker,
  network,
}: Sat20HistoryParams) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `sat20-history-${ticker}`,
    () => request.getSat20TickHistory({ start, limit, ticker, network }),
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

export const useAllSat20StatusList = ({ network, start, limit }: any) => {
  const { data, error, isLoading } = useSWR(
    `sat20-status-list-${network}-${start}-${limit}`,
    () => request.getSat20StatusList({ network, start, limit }),
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

export const useOrdNftList = ({ network, start, limit }: any) => {
  const { data, error, isLoading } = useSWR(
    `ord-nft-list-${network}-${start}-${limit}`,
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

export const useNsListByAddress = ({ address, network, start, limit }: any) => {
  const key = useMemo(
    () => (address ? `ns-list-${address}-${network}-${start}-${limit}` : null),
    [address, network, start, limit]
  );
  const { data, error, isLoading } = useSWR(
    key,
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
