import { BaseResp, ListReq, ListResp } from "./base"

export interface Nft {
    id: number
    name: string
    sat: number
    address: string
    inscriptionId: string
    utxo: string
    value: number
    height: number
    time: number
    inscriptionAddress: string
}

export interface NftStatusListReq extends ListReq { }
export interface NftStatusListResp extends BaseResp {
    data: ListResp & {
        version: string
        nfts: Nft[]
    }
}

export interface NftListReq extends ListReq {
    address?: string
    sat?: number
}

export interface NftListResp extends BaseResp {
    data: ListResp & {
        address: string
        amount: number
        nfts: Nft[]
    }
}

export interface NftDetail extends Nft{
    contenttype: string
    content: string
    metaprotocol: string
    metadata: string
    parent: string
    delegate: string
}

export interface NftDetailResp extends BaseResp {
    data: NftDetail
}