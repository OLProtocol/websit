import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  loading: boolean;
  appVersion: number;
  serviceStatus: number;
  btcHeight: number;
  setLoading: (loading: boolean) => void;
  setServiceStatus: (s: number) => void;
  setAppVersion: (s: number) => void;
  setHeight: (height: number) => void;
  reset: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        loading: false,
        btcHeight: 0,
        appVersion: 0,
        serviceStatus: 0,
        setLoading: (loading) => {
          set({
            loading,
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
