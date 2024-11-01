import { TickerAsset } from "./address";
import { BaseResp, ListReq, ListResp } from "./base"

export interface PlainUtxoListReq extends ListReq {
    address: string
    value: number
}

export interface Utxo {
    txid: string;
    vout: number;
    value: number;
}

export interface PlainUtxoListResp extends BaseResp {
    total : number
    data: Utxo[]
}

export interface AbbrAsset {
    type: string
    ticker: number
    amount: number
}

export interface AbbrAssetListResp extends BaseResp {
    data: ListResp & {
        detail: AbbrAsset[]
    }[]
}

export interface AssetDetailInfo {
    utxo: string
    value: number
    ranges: Range[]
    assets: TickerAsset[]
}

export interface AssetListResp extends BaseResp {
    data: ListResp & {
        detail: AssetDetailInfo
    }
}