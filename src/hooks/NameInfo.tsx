import { useEffect, useState } from 'react';
import { useNameInfo } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { Name } from '@/api/type';


interface NameProps {
    name: string;
}

interface NameRespRecord {
    resp: Name
    timeStamp: number
}

const prefix = 'nameInfo_';
const timeout = 60 * 1000;
const getKey = (name: string) => prefix + name;

export const useNameInfoHook = ({ name }: NameProps) => {
    const [value, setValue] = useState<Name | undefined>(undefined);
    const { data, trigger, isLoading } = useNameInfo( name );

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
        if (!data) return;
        const key = getKey(name);
        const cache = getCachedData(key);
        if (cache) {
            setValue((cache as NameRespRecord).resp);
            return;
        }
        const record: NameRespRecord = {
            resp: data,
            timeStamp: Date.now(),
        };
        setCacheData(key, record);
        setValue(data);

    }, [data]);

    return { value, isLoading };
};