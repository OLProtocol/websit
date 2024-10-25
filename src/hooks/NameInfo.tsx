import { useEffect, useState } from 'react';
import { useNameInfo } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { NameResp } from '@/api/type';


interface NameProps {
    name: string;
}

interface NameRespRecord {
    resp: NameResp
    timeStamp: number
}

const prefix = 'nameInfo_';
const timeout = 60 * 1000;
const getKey = (name: string) => prefix + name;

export const useNameInfoHook = ({ name }: NameProps) => {
    const [value, setValue] = useState<NameResp | undefined>(undefined);
    const { resp, trigger, isLoading } = useNameInfo( name );

    useEffect(() => {
        if (name) {
            const key = getKey(name);
            const record: NameRespRecord = getCachedData(key);
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
    }, [name, trigger]);

    useEffect(() => {
        if (!resp) return;
        const key = getKey(name);
        const cache = getCachedData(key);
        if (cache) {
            setValue((cache as NameRespRecord).resp);
            return;
        }
        const record: NameRespRecord = {
            resp: resp,
            timeStamp: Date.now(),
        };
        setCacheData(key, record);
        setValue(resp);

    }, [resp]);

    return { value, isLoading };
};