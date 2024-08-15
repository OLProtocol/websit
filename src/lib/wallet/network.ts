import { useReactWalletStore } from "@sat20/btc-connect/dist/react";


export const useBtcWalletNetwork = () => {
    const { network } = useReactWalletStore();
    return network
};

export const useNetwork = () => {
    return import.meta.env.VITE_BTC_CHAIN === 'mainnet' ? 'mainnet' : 'testnet'
};

export const getNetwork = () => {
    return import.meta.env.VITE_BTC_CHAIN === 'mainnet' ? 'mainnet' : 'testnet'
};