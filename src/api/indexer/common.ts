import axios from 'axios';

import { BestHeightResp, HealthStatusResp, BlockInfoResp, SatributeListResp, SplittedSatNameListResp, IndexerLayer } from '../type';

const { VITE_API_HOST, VITE_API_SATSNET_INDEX_HOST, VITE_BTC_CHAIN, VITE_ORDX_API_AUTHORIZATION } = import.meta.env;
axios.defaults.headers.common['Authorization'] = VITE_ORDX_API_AUTHORIZATION;

export const generateUrl = (url: string, indexerLayer: IndexerLayer = IndexerLayer.Base) => {
    switch (indexerLayer) {
        case IndexerLayer.Satsnet:
            return `${VITE_API_SATSNET_INDEX_HOST}/${VITE_BTC_CHAIN}/${url}`;
        case IndexerLayer.Base:
            return `${VITE_API_HOST}/${VITE_BTC_CHAIN}/${url}`;
    }
};

const getAppVersion = async (): Promise<string> => {
    const { data } = await axios.get<string>(`/version.txt`);
    return data;
};

const getHealth = async (indexerLayer = IndexerLayer.Base): Promise<HealthStatusResp> => {
    const { data } = await axios.get<HealthStatusResp>(generateUrl(`health`, indexerLayer));
    return data;
};

const getBestHeight = async (indexerLayer = IndexerLayer.Base): Promise<BestHeightResp> => {
    const { data } = await axios.get<BestHeightResp>(generateUrl(`bestheight`, indexerLayer));
    return data;
};

const getBlockInfo = async (height, indexerLayer = IndexerLayer.Base): Promise<BlockInfoResp> => {
    const { data } = await axios.get<BlockInfoResp>(generateUrl(`height/${height}`, indexerLayer));
    return data;
};

const getSatributeList = async (indexerLayer = IndexerLayer.Base): Promise<SatributeListResp> => {
    const { data } = await axios.get<SatributeListResp>(generateUrl(`info/satributes`, indexerLayer));
    return data;
};

const getSplittedSatNameList = async (ticker: string, indexerLayer = IndexerLayer.Base): Promise<SplittedSatNameListResp> => {
    const { data } = await axios.get<SplittedSatNameListResp>(generateUrl(`splittedInscriptions/${ticker}`, indexerLayer));
    return data;
};

const common = {
    generateUrl,
    getAppVersion,
    getHealth,
    getBestHeight,
    getBlockInfo,
    getSatributeList,
    getSplittedSatNameList,
};

export default common;