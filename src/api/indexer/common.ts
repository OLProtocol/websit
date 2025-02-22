import axios, { AxiosResponse } from 'axios';
import { BestHeightResp, HealthStatusResp, BlockInfoResp, SatributeListResp, SplittedSatNameListResp, IndexerLayer, BaseResp, ListResp } from '../type';

export interface ApiResponse<T> extends BaseResp {
    data: T;
}

export interface ListApiResponse<T> extends BaseResp, ListResp {
    data: T;
}

const { VITE_API_HOST, VITE_MAINNET_DOMAIN, VITE_TESTNET_DOMAIN, VITE_API_SATSNET_INDEX_HOST, VITE_BTC_CHAIN, VITE_ORDX_API_AUTHORIZATION } = import.meta.env;
axios.defaults.headers.common['Authorization'] = VITE_ORDX_API_AUTHORIZATION;

export const handleApiRequest = async <T>(requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>) => {
    try {
        const resp = await requestFn();
        if (resp.status !== 200) {
            throw new Error(`API request failed, HTTP status code: ${resp.status}`);
        }
        if (resp.data.code !== 0) {
            throw new Error(`API request failed, code: ${resp.data.code}, msg: ${resp.data.msg}`);
        }
        return resp.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`API request failed, axios error: ${error.message}`);
        }
        throw error;
    }
};

export const handleListApiRequest = async <T>(requestFn: () => Promise<AxiosResponse<ListApiResponse<T>>>) => {
    try {
        const resp = await requestFn();
        if (resp.status !== 200) {
            throw new Error(`API request failed, HTTP status code: ${resp.status}`);
        }
        if (resp.data.code !== 0) {
            throw new Error(`API request failed, code: ${resp.data.code}, msg: ${resp.data.msg}`);
        }
        return resp.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`API request failed, axios error: ${error.message}`);
        }
        throw error;
    }
};

export const generateUrl = (url: string, indexerLayer: IndexerLayer = IndexerLayer.Base) => {
    switch (indexerLayer) {
        case IndexerLayer.Satsnet:
            return `${VITE_API_SATSNET_INDEX_HOST}/${VITE_BTC_CHAIN}/${url}`;
        case IndexerLayer.Base:
            return `${VITE_API_HOST}/${VITE_BTC_CHAIN}/${url}`;
    }
};

const getAppVersion = async (): Promise<string> => {
    let domain = '';
    switch (VITE_BTC_CHAIN) {
        case 'mainnet':
            domain = VITE_MAINNET_DOMAIN;
            break;
        case 'testnet':
            domain = VITE_TESTNET_DOMAIN;
            break;
    }
    const { data } = await axios.get<string>(`${domain}/version.txt`);
    return data;
};

const getHealth = async (indexerLayer = IndexerLayer.Base): Promise<HealthStatusResp> => {
    const url = `health`;
    const { data } = await axios.get<HealthStatusResp>(generateUrl(url, indexerLayer));
    return data;
};

const getBestHeight = async (indexerLayer = IndexerLayer.Base): Promise<BestHeightResp> => {
    const url = `bestheight`;
    const { data } = await axios.get<BestHeightResp>(generateUrl(url, indexerLayer));
    return data;
};

// const getBlockInfo = async (height, indexerLayer = IndexerLayer.Base): Promise<BlockInfoResp> => {
//     const url = `height/${height}`
//     return handleApiRequest(() => axios.get<BlockInfoResp>(generateUrl(url, indexerLayer)));
// };

const getBlockInfo = async (height, indexerLayer = IndexerLayer.Base): Promise<any> => {
    const url = `height/${height}`
    return handleApiRequest(() => axios.get<any>(generateUrl(url, indexerLayer)));
};

const getSatributeList = async (indexerLayer = IndexerLayer.Base): Promise<SatributeListResp> => {
    const url = `info/satributes`
    return handleApiRequest(() => axios.get<SatributeListResp>(generateUrl(url, indexerLayer)));
};

const getSplittedSatNameList = async (ticker: string, indexerLayer = IndexerLayer.Base): Promise<SplittedSatNameListResp> => {
    const url = `splittedInscriptions/${ticker}`
    return handleApiRequest(() => axios.get<SplittedSatNameListResp>(generateUrl(url, indexerLayer)));
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