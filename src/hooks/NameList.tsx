import { useEffect, useState } from 'react';
import { useNameList } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { IndexerLayer, NameList, NameListResp } from '@/api/type';
import { getIndexerLayerKey } from '@/api/type/util';
import indexer from '@/api/indexer';


interface NameListProps {
    address: string;
    start: number;
    limit: number;
}

interface NameListRespRecord {
    resp: NameList
    timeStamp: number
}

const prefix = 'nameList_';
const timeout = 60 * 1000;

const getKey = (address: string, start: number, limit: number, indexerLayer: IndexerLayer) => {
    return prefix + getIndexerLayerKey(indexerLayer) + address + '_' + start + '_' + limit;
}

export const useNameListHook = ({ address, start, limit }: NameListProps, indexerLayer: IndexerLayer) => {
    const [value, setValue] = useState<NameList | undefined>(undefined);
    const fetchData = async () => {
        if (address && limit > 0 && start >= 0) {
            const key = getKey(address, start, limit, indexerLayer);
            const record: NameListRespRecord = getCachedData(key);
            if (!record || Date.now() - record.timeStamp > timeout) {
                const data = await indexer.ns.getNameList({address, start, limit}, indexerLayer);
                const record: NameListRespRecord = {
                    resp: data.data,
                    timeStamp: Date.now(),
                };
                setCacheData(key, record);
                setValue(data.data);
            } else {
                setValue(record.resp);
            }
        }
    };
    useEffect(() => {
        fetchData();
    }, [address, limit, start]);

    return { value };
};