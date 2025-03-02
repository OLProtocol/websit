import { ListReq, ListResp, BaseResp, AddressReq } from './base'

import { AssetName } from './ticker';

export interface AddressAssetsSummaryReq extends ListReq, AddressReq { }

export interface RangeV1 {
    Start: number;
    End: number;
}

export interface DisplayAsset {
    Name: AssetName;
    Amount: string;
    BindingSat: number;
    Offset?: RangeV1[];
}

export interface AddressAssetsSummaryResp extends BaseResp {
    data: DisplayAsset[]
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
        ranges: RangeV1[]
    }[]
}

export interface UtxoListResp extends BaseResp {
    data: ListResp & {
        detail: TickerAsset[]
    }
}