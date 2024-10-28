import { BaseResp, ListReq, ListResp } from "./base"
import { AddressListReq } from "./common"
import { Nft } from "./nft"

export interface NameStatusListReq extends ListReq { }

export interface NameStatusListResp extends BaseResp {
    data: ListResp & {
        version: string,
        names: Nft[]
    }
}

export interface Name extends ListResp, Nft {
    kvs: {
        key: string
        value: string
        inscriptionId: string
    }[];
}

export interface NameListReq extends AddressListReq {
    sub?: string;
}
export interface NameList extends ListResp {
    address: string
    total: number
    names: Name[]
}
export interface NameListResp extends BaseResp {
    data: NameList
}

export interface NameResp extends BaseResp {
    data: Name
}
