import { TriggerWithoutArgs } from "swr/mutation";

// base
interface BaseResp {
  code: number;
  msg: string;
}

interface ListResp {
  start: number;
  total: number;
}

export interface ListReq {
  start: number;
  limit: number;
}

export interface AddressReq {
  address?: string;
}

export interface AddressListReq extends ListReq {
  address?: string;
}

// token info
export interface SwrTokenInfo {
  resp: TokenInfoResp;
  error: any;
  isLoading: boolean;
}

export interface TokenInfoResp {
  code: number;
  msg: string;
  data: TokenInfoData;
}

export interface TokenInfoReq {
  tick?: string;
}

export interface TokenInfoData {
  id: number;
  ticker: string;
  startBlock: number;
  endBlock: number;
  totalMinted: number;
  limit: number;
  selfmint: number;
  max: number;
  deployHeight: number;
  mintTimes: number;
  holdersCount: number;
  deployBlocktime: number;
  inscriptionId: string;
  inscriptionNum: number;
  description: string;
  rarity: string;
  deployAddress: string;
  content?: string;
  contenttype?: string;
  delegate?: string;
  txid: string;
}



// token summary list


export interface TokenBalanceSummaryList {
  type: string;
  ticker: string;
  balance: number;
}

export interface TokenBalanceSummaryListData extends ListResp {
  detail: TokenBalanceSummaryList[];
}

export interface TokenBalanceSummaryListResp extends BaseResp {
  data?: TokenBalanceSummaryListData;
}

export interface SwrTokenBalanceSummaryListInfo {
  resp?: TokenBalanceSummaryListResp;
  error: any;
  isLoading: boolean;
  reset: () => void;
  trigger: TriggerWithoutArgs<any, any, `token-balance-summary-${string}`, never>
}

//
export interface TokenReq {
  address?: string;
  ticker?: string;
  start: number;
  limit: number;
}

export interface TxStatusParams {
  txid: string;
  network: string;
}

// name 
export interface KVItem {
  key: string;
  value: string;
  inscriptionId: string;
}

export interface NftItem {
  id: number;
  name: string;
  sat: number;
  address: string;
  inscriptionId: string;
  utxo: string;
  value: number;
  height: number;
  time: number;
  inscriptionAddress: string;
}

export interface OrdinalsName extends NftItem {
  kvs: KVItem[];
}

export interface NamesData {
  address: string;
  total: number;
  names: OrdinalsName[];
}

// name ns/address
export interface NameListResp {
  code: number;
  msg: string;
  data: NamesData;
}

export interface SwrNameList {
  resp?: NameListResp;
  error: any;
  isLoading: boolean;
  reset: () => void;
  trigger: TriggerWithoutArgs<any, any, `address-name-list-${any}-${any}-${any}`, never>
}

// name name info
export interface NameReq {
  name?: string;
}

export interface NameInfoResp extends BaseResp {
  data?: OrdinalsName;
}

export interface SwrNameInfo {
  resp?: NameInfoResp;
  error: any;
  isLoading: boolean;
  reset: () => void;
  trigger: TriggerWithoutArgs<any, any, `name-info-${string}`, never>
}