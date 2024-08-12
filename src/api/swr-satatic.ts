import useSWR from 'swr';
import * as request from './request';
import { getStaticUseSwrFunc } from './swr-util';
import { BtcNetwork } from '@/types';
import { fetchChainFeeRate } from '@/lib/utils';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';

export const useOrdxVersion = () => {
    const { data, error, isLoading } = getStaticUseSwrFunc(`health`, request.getHealth, {})();
    const version = data?.version
    return {
        version,
        error,
        isLoading,
    };
};

export const useBtcHeight = () => {
    return getStaticUseSwrFunc(`btcHeight`, request.getBestHeight, {})();
};

export const useBtcFeeRate = () => {
    const { network } = useReactWalletStore(state => state);
    return getStaticUseSwrFunc(`fee-${network}`, fetchChainFeeRate, network)();
};

export const useSatTypes = () => {
    return getStaticUseSwrFunc(`sat-types`, request.getSatTypes, {})();
};


export const useAppVersion = () => {
    return getStaticUseSwrFunc(`app-version`, request.getAppVersion, {})();
};