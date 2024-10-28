import {
    NameListResp,
    AssetsSummaryResp,
    NameResp,
    TickerStatusResp,
} from '@/api/type';

import { TriggerWithoutArgs } from "swr/mutation";

export interface SwrAddressAssetsSummary {
    resp?: AssetsSummaryResp;
    error: any;
    isLoading: boolean;
    reset: () => void;
    trigger: TriggerWithoutArgs<any, any, `${string}-address-assets-summary-${string}`, never>
}

export interface SwrNameInfo {
    resp?: NameResp;
    error: any;
    isLoading: boolean;
    reset: () => void;
    trigger: TriggerWithoutArgs<any, any, `${string}-name-info-${string}`, never>
}