import { ListReq, ListResp, BaseResp } from './base';

export interface TickerReq {
    ticker: string
}

export interface TickerListReq extends ListReq, TickerReq {}

export interface TickerStatus {
    id: number
    ticker: string
    startBlock: number
    endBlock: number
    totalMinted: number
    limit: number
    selfmint: number
    max: number
    deployHeight: number
    mintTimes: number
    holdersCount: number
    deployBlocktime: number
    inscriptionId: string
    inscriptionNum: number
    description: string
    rarity: string
    deployAddress: string
    content?: string
    contenttype?: string
    delegate?: string
    txid: string
}
export interface TickerStatusListReq extends ListReq { }
export interface TickerStatusList extends ListResp {
    height: number
    detail?: TickerStatus[]
}
export interface TickerStatusListResp extends BaseResp {
    data: TickerStatusList
}

export interface TickerStatusReq extends TickerReq { }
export interface TickerStatusResp extends BaseResp {
    data: TickerStatus
}


export interface TickerHolderReq extends TickerListReq { }
export interface TickerHolderResp extends BaseResp {
    data: ListResp & {
        detail: {
            wallet: string
            total_balance: number
        }[]
    }
}

// v3
export interface AssetName {
    protocol: string; // 4种: ordx, ord, brc20, runes
    type: string; // 4种: ASSET_TYPE_NFT = "o" , ASSET_TYPE_FT = "f", ASSET_TYPE_EXOTIC = "e", ASSET_TYPE_NS = "n"
    ticker: string; // 如果Type是nft类型，ticker是合集名称#铭文序号（或者聪序号）
}

export interface TickerInfo {
    name: AssetName;
    displayName: string;
    id: number;
    divisibility?: number;
    startBlock?: number;
    endBlock?: number;
    selfMint?: number;
    deployHeight: number;
    deployBlockTime: number;
    deployTx: string;
    limit: string;
    n: number;
    totalMinted: string;
    mintTimes: number;
    maxSupply?: string;
    holdersCount: number;
    inscriptionId?: string;
    inscriptionNum?: number;
    description?: string;
    rarity?: string;
    deployAddress?: string;
    content?: Uint8Array;
    contentType?: string;
    delegate?: string;
}

export interface TickerListRespV3 extends BaseResp, ListResp {
    data: TickerInfo[]
}

export interface TickerRespV3 extends BaseResp {
    data: TickerInfo
}

export type RuneListResp = TickerListRespV3

export type RuneResp = TickerRespV3;

export interface TickerListReqV3 extends ListReq {
    protocol: string
}

export type TickerReqV3 = AssetName 
export type RuneReq = TickerReqV3
export type RuneListReq = TickerListReqV3