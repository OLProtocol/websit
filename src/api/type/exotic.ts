import { ListReq, BaseResp, AddressReq } from './base'
import { SatRange } from './common'

export interface SpecificExoticAssetReq extends AddressReq { 
    type: string
}

export interface SpecificExoticAsset {
    type: string
    ticker: string
    balance: number
}

export interface SpecificExoticAssetResp extends BaseResp {
    data: SpecificExoticAsset[]
}

export interface Sat extends SatRange{
    satributes: string[]
    block: number
}

export interface ExoticSatInfo extends ListReq {
    utxo: string
    value: number
    sats: Sat[]
}

export interface ExoticSatInfoResp extends BaseResp {
    data: ExoticSatInfo
}

export interface ExoticSatInfoListResp extends BaseResp {
    data: ExoticSatInfo[]
}