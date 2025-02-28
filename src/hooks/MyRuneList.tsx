import { useEffect, useState } from 'react';
import { useNameList } from '@/swr';
import { getCachedData, setCacheData } from '@/lib/utils/cache';
import { IndexerLayer, NameList, NameListResp, RuneListResp } from '@/api/type';
import { getIndexerLayerKey } from '@/api/type/util';
import indexer from '@/api/indexer';


interface MyRuneListProps {
    address: string;
    start: number;
    limit: number;
}

interface MyRuneListRespRecord {
    resp: RuneListResp
    timeStamp: number
}

const prefix = 'myRuneList_';
const timeout = 60 * 1000;

const getKey = (address: string, start: number, limit: number, indexerLayer: IndexerLayer) => {
    return prefix + getIndexerLayerKey(indexerLayer) + address + '_' + start + '_' + limit;
}

// export const useMyRuneListHook = ({ address, start, limit }: MyRuneListProps, indexerLayer: IndexerLayer) => {
//     const [value, setValue] = useState<NameList | undefined>(undefined);
//     const fetchData = async () => {
//         if (address && limit > 0 && start >= 0) {
//             const key = getKey(address, start, limit, indexerLayer);
//             const record: MyRuneListRespRecord = getCachedData(key);
//             if (!record || Date.now() - record.timeStamp > timeout) {
//                 indexer.runes.getRuneList({start, limit}, indexerLayer)
//                 const data = await indexer.ns.getNameList({address, start, limit}, indexerLayer);
//                 const record: MyRuneListRespRecord = {
//                     resp: data.data,
//                     timeStamp: Date.now(),
//                 };
//                 setCacheData(key, record);
//                 setValue(data.data);
//             } else {
//                 setValue(record.resp);
//             }
//         }
//     };
//     useEffect(() => {
//         fetchData();
//     }, [address, limit, start]);

//     return { value };
// };