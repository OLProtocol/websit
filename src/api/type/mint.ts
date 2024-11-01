import { BaseResp } from './base'
import { Range } from './common'

export interface MintDetailInfo {
    id: number
    ticker: string
    address: string
    amount: number
    mintTimes: number
    delegate: string
    content: string
    contenttype: string
    ranges: Range[]
    inscriptionId: string
    inscriptionNumber: number
}

export interface MintDetailInfoResp extends BaseResp {
    data: MintDetailInfo
}