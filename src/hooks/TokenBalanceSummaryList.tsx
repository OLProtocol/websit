import { useEffect, useState } from 'react';
import { useAddressAssetsSummary } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { AssetsSummary, AssetsSummaryResp, IndexerLayer } from '@/api/type';
import { getIndexerLayerKey } from '@/api/type/util';


interface TokenBalanceSummaryListProps {
    address: string;
}

interface TokenBalanceSummaryRespRecord {
    data: AssetsSummary
    timeStamp: number
}

const prefix = 'token_balance_summary_list_';
const timeout = 60 * 1000;
const getKey = (address: string, indexerLayer: IndexerLayer) => {
    return prefix + getIndexerLayerKey(indexerLayer) + address;
}

export const useTokenBalanceSummaryListHook = ({ address }: TokenBalanceSummaryListProps, indexerLayer: IndexerLayer = IndexerLayer.Base) => {
    const [value, setValue] = useState<AssetsSummary | undefined>(undefined);
    let keyPreFix = getIndexerLayerKey(indexerLayer);
    const { data, trigger, isLoading } = useAddressAssetsSummary({ start:0, limit: 100, address }, keyPreFix, indexerLayer);

    useEffect(() => {
        if (address) {
            const key = getKey(address, indexerLayer);
            const record: TokenBalanceSummaryRespRecord = getCachedData(key);
            if (!record) {
                trigger();
                return;
            }
            const diff = Date.now() - record.timeStamp;
            if (diff > timeout) {
                trigger();
                return;
            }
            setValue(record.data);
        }
    }, [address, trigger]);

    useEffect(() => {
        //  if (!address) return;
        if (!data) return;
        const key = getKey(address, indexerLayer);
        const cache = getCachedData(key);
        if (cache) {
            setValue((cache as TokenBalanceSummaryRespRecord).data);
            return;
        }
        const record: TokenBalanceSummaryRespRecord = {
            data: data,
            timeStamp: Date.now(),
        };
        setCacheData(key, record);
        setValue(data);
    }, [data]);

    return { value, isLoading };
};