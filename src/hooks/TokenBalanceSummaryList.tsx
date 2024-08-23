import { useEffect, useMemo, useState } from 'react';
import { useTokenBalanceSummaryList } from '@/api';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { NameListResp, TokenBalanceSummaryListResp } from '@/api/types';


interface TokenBalanceSummaryListProps {
    address: string;
}

interface TokenBalanceSummaryRespRecord {
    resp: TokenBalanceSummaryListResp
    timeStamp: number
}

const prefix = 'token_balance_summary_list_';
const timeout = 60 * 1000;
const getKey = (address: string) => prefix + address;

export const useTokenBalanceSummaryListHook = ({ address }: TokenBalanceSummaryListProps) => {
    const [value, setValue] = useState<TokenBalanceSummaryListResp | undefined>(undefined);
    const { resp, trigger, isLoading } = useTokenBalanceSummaryList({ address });

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