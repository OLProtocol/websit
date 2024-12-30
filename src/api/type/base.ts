
export interface TickerReq {
    ticker: string
}

export interface AddressReq {
    address: string
}

export interface BaseResp {
    code: number
    msg: string
}

export interface ListReq {
    start?: number
    limit?: number
}

export interface ListResp {
    start: number
    total: number
}

export enum IndexerLayer {
    Base = 1,
    Satsnet = 2
}
