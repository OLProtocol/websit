import { ListReq, ListResp, BaseResp, AddressReq, TickerReq } from './base';
import { TickerListReq } from './common';

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