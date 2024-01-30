import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { InscribeType } from '@/types';

type OrderStatus = 'pending' | 'paid'|  'inscribe_wait' |  'inscribe_success' | 'inscribe_fail';
export interface OrderItemType {
  orderId: string;
  type: InscribeType;
  inscriptions: any[];
  secret: string;
  txid?: string;
  inscriptionSize: number;
  toAddress: string[];
  network: string;
  fee: {
    serviceFee: number;
    totalFee: number;
    networkFee: number;
  };
  funding?: {
    script: any;
    leaf: string;
    cblock: string;
    tapkey: string;
    address: string;
    txid: string;
    vout: number;
    amount: number;
  };
  commitTx?: {
    txid: string;
    outputs: any[];
  };
  feeRate: number;
  status: OrderStatus;
  createAt: number;
}
interface OrderState {
  list: OrderItemType[];
  setList: (l: OrderItemType[]) => void;
  add: (item: OrderItemType) => void;
  addTxidToInscription: (orderId: string, index: number, txid: string) => void;
  changeInscriptionStatus: (
    orderId: string,
    index: number,
    status: OrderStatus,
  ) => void;
  changeStatus: (orderId: string, status: OrderStatus) => void;
  setFunding: (orderId: string, funding: any) => void;
  setCommitTx: (orderId: string, tx: any) => void;
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
        addTxidToInscription: (orderId, index, txid) => {
          const list = get().list.map((item) => {
            if (item.orderId === orderId) {
              item.inscriptions[index].txid = txid;
            }
            return item;
          });
          set({
            list,
          });
        },
        setFunding: (orderId, funding) => {
          const list = get().list.map((item) => {
            if (item.orderId === orderId) {
              item.funding = funding;
            }
            return item;
          });
          set({
            list,
          });
        },
        setCommitTx: (orderId, tx) => {
          const list = get().list.map((item) => {
            if (item.orderId === orderId) {
              item.commitTx = tx;
            }
            return item;
          });
          set({
            list,
          });
        },
        changeInscriptionStatus: (orderId, index, status: OrderStatus) => {
          const list = get().list.map((item) => {
            if (item.orderId === orderId) {
              item.inscriptions[index].status = status;
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
