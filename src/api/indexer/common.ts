import axios, { AxiosResponse } from 'axios';
import { BestHeightResp, HealthStatusResp, BlockInfoResp, SatributeListResp, SplittedSatNameListResp } from '../type';

export interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

const { VITE_API_HOST, VITE_BTC_CHAIN, VITE_ORDX_API_AUTHORIZATION } = import.meta.env;
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

export const generateUrl = (url: string) => {
    return `${VITE_API_HOST}/${VITE_BTC_CHAIN}/${url}`;
};

const getAppVersion = async (): Promise<string> => {
    const url = `version.txt`;
    const { data } = await axios.get<string>(generateUrl(url));
    return data;
};

const getHealth = async (): Promise<HealthStatusResp> => {
    const url = `health`;
    const { data } = await axios.get<HealthStatusResp>(generateUrl(url));
    return data;
};

const getBestHeight = async (): Promise<BestHeightResp> => {
    const url = `bestheight`;
    const { data } = await axios.get<BestHeightResp>(generateUrl(url));
    return data;
};

const getBlockInfo = async (height): Promise<BlockInfoResp> => {
    const url = `height/${height}`
    return handleApiRequest(() => axios.get<BlockInfoResp>(generateUrl(url)));
};

const getSatributeList = async (): Promise<SatributeListResp> => {
    const url = `info/satributes`
    return handleApiRequest(() => axios.get<SatributeListResp>(generateUrl(url)));
};

const getSplittedSatNameList = async (ticker: string): Promise<SplittedSatNameListResp> => {
    const url = `splittedInscriptions/${ticker}`
    return handleApiRequest(() => axios.get<SplittedSatNameListResp>(generateUrl(url)));
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