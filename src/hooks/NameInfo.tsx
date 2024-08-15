import { useEffect, useMemo, useState } from 'react';
import { useNameInfo, useAddressNameList } from '@/api';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { NameInfoResp } from '@/api/types';


interface NameInfoProps {
    name: string;
}

interface NameInfoRespRecord {
    resp: NameInfoResp
    timeStamp: number
}

const prefix = 'nameInfo_';
const timeout = 60 * 1000;
const getKey = (name: string) => prefix + name;

export const useNameInfoHook = ({ name }: NameInfoProps) => {
    const [value, setValue] = useState<NameInfoResp | undefined>(undefined);
    const { resp, trigger, isLoading } = useNameInfo({ name });

    useEffect(() => {
        if (name) {
            const key = getKey(name);
            const record: NameInfoRespRecord = getCachedData(key);
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
    }, [name, trigger]);

    useEffect(() => {
        if (!name) return;

        const key = getKey(name);
        const cache = getCachedData(key);
        if (cache) {
            setValue((cache as NameInfoRespRecord).resp);
            return;
        }
        if (resp) {
            const nameListRespRecord: NameInfoRespRecord = {
                resp: resp,
                timeStamp: Date.now(),
            };
            setCacheData(key, nameListRespRecord);
            setValue(resp);
        }
    }, [name, resp]);

    return { value, isLoading };
};