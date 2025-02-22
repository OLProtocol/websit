
import { ListReq, BaseResp, AddressReq } from './base'

export interface HealthStatusResp {
  status: string
  version: string
  basedbver: string
  ordxdbver: string
}

export interface BestHeightResp {
  data: {
    height: number
  }
}

export interface BlockInfo {
  height: number
  timestamp: number
  totalsats: number
  rewardsats: number
}

export interface BlockInfoResp extends BaseResp {
  data: BlockInfo
}

export interface SatributeListResp extends BaseResp {
  data: string[]
}

export interface SplittedSatNameListResp extends BaseResp {
  data: string[]
}

export interface AddressListReq extends ListReq, AddressReq {}



export interface Range {
  start: number
  size: number
}

export interface SatRange extends Range {
  offset: number
}

