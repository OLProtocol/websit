import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  feeRate: {
    value: number;
    type: string;
  };
  loading: boolean;
  appVersion: number;
  serviceStatus: number;
  btcHeight: number;
  setFeeRate: (rate: { value: number; type: string }) => void;
  setLoading: (loading: boolean) => void;
  setServiceStatus: (s: number) => void;
  setAppVersion: (s: number) => void;
  setHeight: (height: number) => void;
  reset: () => void;
}

export const useCommonStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        loading: false,
        feeRate: {
          value: 1,
          type: 'fastestFee',
        },
        btcHeight: 0,
        appVersion: 0,
        serviceStatus: 0,
        setLoading: (loading) => {
          set({
            loading,
          });
        },
        setFeeRate: (rate) => {
          set({
            feeRate: rate,
          });
        },
        setServiceStatus: (s) => {
          set({
            serviceStatus: s,
          });
        },
        setAppVersion: (s) => {
          set({
            appVersion: s,
          });
        },
        setHeight: (height) => {
          set({
            btcHeight: height,
          });
        },
        reset: () => {
          set({
            loading: false,
            serviceStatus: 0,
            btcHeight: 0,
          });
        },
      }),
      {
        name: 'common-store',
      },
    ),
  ),
);
