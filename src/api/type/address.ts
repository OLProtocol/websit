import { ListReq, ListResp, BaseResp, AddressReq } from './base'
import { Range } from './common'

export interface AssetsSummaryReq extends ListReq, AddressReq { }

export interface AssetsSummary extends ListResp{
    detail: {type: string
    ticker: string
    balance: number}[]
}

export interface AssetsSummaryResp extends BaseResp {
    data: AssetsSummary
}

export interface MintHistoryReq extends ListReq {
    ticker: string
    address?: string
}

export interface MintHistory {
    type: string
    ticker: string
    total: number
    start: number
    limit: number
    items: {
        mintaddress: string
        holderaddress: string
        balance: number
        inscriptionId: string
        inscriptionNumber: number
    }[]
}

export interface MintHistoryResp extends BaseResp {
    data: ListResp & {
        detail: MintHistory
    }
}

export interface UtxoListReq extends ListReq {
    ticker: string
    address: string
}

export interface TickerAsset {
    type: string
    ticker: string
    utxo: number
    amount: number
    assetamount: number
    assets: {
        type: string
        ticker: string
        inscriptionId: number
        inscriptionnum: string
        assetamount: number
        ranges: Range[]
    }[]
}

export interface UtxoListResp extends BaseResp {
    data: ListResp & {
        detail: TickerAsset[]
    }
}