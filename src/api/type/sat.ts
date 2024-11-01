import { AddressReq, BaseResp } from "./base";
import { SatRange } from "./common";

export interface SpecificSatListReq extends AddressReq {
    sats: number[]
}

export interface SpecificSpecialSat {
    addrdss: string
    utxo: string
    value: number
    specificsat: number
    sats: SatRange[]
}

export interface SpecificSatListResp extends BaseResp {
    data: SpecificSpecialSat[]
}