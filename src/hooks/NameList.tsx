import { useEffect, useMemo, useState } from 'react';
import { useNameList } from '@/api';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { NameListResp } from '@/api/types';


interface NameListProps {
    address: string;
    start: number;
    limit: number;
}

interface NameListRespRecord {
    resp: NameListResp
    timeStamp: number
}

const prefix = 'nameList_';
const timeout = 60 * 1000;
const getKey = (address: string, start: number, limit: number) => prefix + address + '_' + start + '_' + limit;

export const useNameListHook = ({ address, start, limit }: NameListProps) => {
    const [value, setValue] = useState<NameListResp | undefined>(undefined);
    const { resp, trigger, isLoading } = useNameList({
        address,
        start,
        limit,
    });

    useEffect(() => {
        if (address && limit !== undefined && start !== undefined) {
            const key = getKey(address, start, limit);
            const record: NameListRespRecord = getCachedData(key);
            if (!record) {
                trigger();
                return;
            }
            const diff = Date.now() - record.timeStamp;
            if (diff > timeout) {
                trigger();
                return;
            }
        }
    }, [address, limit, start, trigger]);

    useEffect(() => {
        if (!address) return;
        if (limit === undefined || start === undefined) return;
        const key = getKey(address, start, limit);
        const cache = getCachedData(key);
        if (cache) {
            setValue((cache as NameListRespRecord).resp);
            return;
        }
        if (resp) {
            const nameListRespRecord: NameListRespRecord = {
                resp: resp,
                timeStamp: Date.now(),
            };
            setCacheData(key, nameListRespRecord);
            setValue(resp);
        }
    }, [address, resp, limit, start]);

    return { value, isLoading };
};