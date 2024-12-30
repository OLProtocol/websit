import { useEffect, useState } from 'react';
import { useNameInfo } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { IndexerLayer, Name } from '@/api/type';
import { getIndexerLayerKey } from '@/api/type/util';


interface NameProps {
    name: string;
}

interface NameRespRecord {
    resp: Name
    timeStamp: number
}

const prefix = 'nameInfo_';
const timeout = 60 * 1000;
const getKey = (name: string, indexerLayer: IndexerLayer) => {
    return prefix + getIndexerLayerKey(indexerLayer) + name;
}

export const useNameInfoHook = ({ name }: NameProps, indexerLayer: IndexerLayer) => {
    const [value, setValue] = useState<Name | undefined>(undefined);
    const { data, trigger, isLoading } = useNameInfo( name );

    useEffect(() => {
        if (name) {
            const key = getKey(name, indexerLayer);
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
        const key = getKey(name, indexerLayer);
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