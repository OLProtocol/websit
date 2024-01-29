export interface Ord2ListStatusParams {
  start: number;
  limit: number;
  sort?: string;
  network: string;
  ticker_hex?: string;
  complete?: string;
}
export interface Ord2InfoParams {
  tick?: string;
  network: string;
}
export interface OrdXSummaryParams {
  address?: string;
  network: string;
}

export interface OrdXHistoryParams {
  address?: string;
  ticker?: string;
  network: string;
}

export interface OrdXHistoryDetailParams {
  address?: string;
  ticker?: string;
  network: string;
  start?: number;
  limit?: number;
}