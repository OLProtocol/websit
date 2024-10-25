import { useEffect, useState } from 'react';
import { useAddressAssetsSummary } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { AssetsSummaryResp } from '@/api/type';


interface TokenBalanceSummaryListProps {
    address: string;
}

interface TokenBalanceSummaryRespRecord {
    resp: AssetsSummaryResp
    timeStamp: number
}

const prefix = 'token_balance_summary_list_';
const timeout = 60 * 1000;
const getKey = (address: string) => prefix + address;

export const useTokenBalanceSummaryListHook = ({ address }: TokenBalanceSummaryListProps) => {
    const [value, setValue] = useState<AssetsSummaryResp | undefined>(undefined);
    const { resp, trigger, isLoading } = useAddressAssetsSummary({ start:0, limit: 100, address });

    useEffect(() => {
        if (address) {
            const key = getKey(address);
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
            setValue(record.resp);
        }
    }, [address, trigger]);

    useEffect(() => {
        //  if (!address) return;
        if (!resp) return;
        const key = getKey(address);
        const cache = getCachedData(key);
        if (cache) {
            setValue((cache as TokenBalanceSummaryRespRecord).resp);
            return;
        }
        const record: TokenBalanceSummaryRespRecord = {
            resp: resp,
            timeStamp: Date.now(),
        };
        setCacheData(key, record);
        setValue(resp);
    }, [resp]);

    return { value, isLoading };
};