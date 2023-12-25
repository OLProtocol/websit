import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { InscribeType } from '@/types';

type OrderStatus = 'pending' | 'paid' | 'inscribe_success' | 'inscribe_fail';
export interface OrderItemType {
  orderId: string;
  type: InscribeType;
  files: any[];
  secret: string;
  txid?: string;
  inscriptionAddress: string;
  inscriptionSize: number;
  toAddress: string[];
  fee: number;
  feeRate: number;
  status: OrderStatus;
  createAt: number;
}
interface OrderState {
  list: OrderItemType[];
  setList: (l: OrderItemType[]) => void;
  add: (item: OrderItemType) => void;
  addTxid: (orderId: string, txid: string) => void;
  changeStatus: (orderId: string, status: OrderStatus) => void;
  findOrder: (orderId: string) => OrderItemType | undefined;
  reset: () => void;
}

export const useOrderStore = create<OrderState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        setList: (l) => {
          set({
            list: l,
          });
        },
        add: (l) => {
          set({
            list: [...get().list, l],
          });
        },
        addTxid: (orderId, txid) => {
          const list = get().list.map((item) => {
            if (item.orderId === orderId) {
              item.txid = txid;
            }
            return item;
          });
          set({
            list,
          });
        },
        changeStatus: (orderId, status: OrderStatus) => {
          const list = get().list.map((item) => {
            if (item.orderId === orderId) {
              item.status = status;
            }
            return item;
          });
          set({
            list,
          });
        },
        findOrder: (orderId) => {
          const list = get().list;
          const order = list.find((item) => item.orderId === orderId);
          return order;
        },
        reset: () => {
          set({
            list: [],
          });
        },
      }),
      {
        name: 'global-store',
      },
    ),
  ),
);
