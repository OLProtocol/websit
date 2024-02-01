import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  loading: boolean;
  serviceStatus: boolean;
  btcHeight: number;
  setLoading: (loading: boolean) => void;
  setServiceStatus: (s: boolean) => void;
  setHeight: (height: number) => void;
  reset: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        loading: false,
        btcHeight: 0,
        serviceStatus: false,
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
        setHeight: (height) => {
          set({
            btcHeight: height,
          });
        },
        reset: () => {
          set({
            loading: false,
            serviceStatus: false,
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
