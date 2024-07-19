export interface Sat20ListStatusParams {
  start: number;
  limit: number;
  sort?: string;
  network: string;
}
export interface Sat20InfoParams {
  tick?: string;
  network: string;
}
export interface Sat20SummaryParams {
  address?: string;
  network: string;
}

export interface Sat20HistoryParams {
  address?: string;
  ticker?: string;
  network: string;
  start: number;
  limit: number;
}

export interface Sat20HistoryDetailParams {
  address?: string;
  ticker?: string;
  network: string;
  start?: number;
  limit?: number;
}
export interface TxStatusParams {
  txid: string;
  network: string;
}

