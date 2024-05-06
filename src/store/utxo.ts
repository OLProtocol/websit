import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { getUtxoByValue } from '@/api';
export enum UtxoStatus {
  AVIALABLE,
  UNAVALABLE,
}
export interface UtxoStroeItem {
  txid: string;
  vout: number;
  value: number;
  status: UtxoStatus;
}
interface UtxoState {
  list: UtxoStroeItem[];
  reset: () => void;
  getRemoteList: () => Promise<UtxoStroeItem[]>;
  setList: (list: UtxoStroeItem[]) => void;
  changeStatus: (txid: string, vout: number, status: UtxoStatus) => void;
  changeListStatus: (list: any[], status: UtxoStatus) => void;
  remove: (txid: string, vout: number) => void;
  add: (item: UtxoStroeItem) => void;
}

export const useOrderStore = create<UtxoState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        setList: (list: UtxoStroeItem[]) => {
          set({
            list,
          });
        },
        getRemoteList: async () => {
          const { address, network } = useReactWalletStore.getState();
          if (!address) {
            return [];
          }
          const utxoList = await getUtxoByValue({ address, network, value: 0 });
          const list = utxoList.map((item) => {
            return {
              txid: item.txid,
              vout: item.vout,
              value: item.value,
              status: UtxoStatus.AVIALABLE,
            };
          });
          set({
            list,
          });
          return list;
        },
        changeStatus: (txid: string, vout: number, status: UtxoStatus) => {
          const list = get().list.map((item) => {
            if (item.txid === txid && item.vout === vout) {
              return {
                ...item,
                status,
              };
            }
            return item;
          });
          set({
            list,
          });
        },
        changeListStatus: (list: any[], status: UtxoStatus) => {
          const oldList = get().list;
          oldList.forEach((item) => {
            if (
              list.find((i) => i.txid === item.txid && i.vout === item.vout)
            ) {
              item.status = status;
            }
          });
          set({
            list: oldList,
          });
        },
        remove: (txid: string, vout: number) => {
          const list = get().list.filter(
            (item) => item.txid !== txid || item.vout !== vout,
          );
          set({
            list,
          });
        },
        add: (item: UtxoStroeItem) => {
          const list = [...get().list, item];
          set({
            list,
          });
        },
        reset: () => {
          set({
            list: [],
          });
        },
      }),
      {
        name: 'utxo-store',
      },
    ),
  ),
);
