import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  loading: boolean;
  btcHeight: number;
  setLoading: (loading: boolean) => void;
  setHeight: (height: number) => void;
  reset: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        loading: false,
        btcHeight: 0,
        setLoading: (loading) => {
          set({
            loading,
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
            btcHeight: 0,
          });
        },
      }),
      {
        name: 'global-store',
      },
    ),
  ),
);
