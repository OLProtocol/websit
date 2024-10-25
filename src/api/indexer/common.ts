import axios from 'axios';

import { BestHeightResp, HealthStatusResp, BlockInfoResp, SatributeListResp, SplittedSatNameListResp } from '../type';

const { VITE_API_HOST, VITE_BTC_CHAIN, VITE_ORDX_API_AUTHORIZATION } = import.meta.env;
axios.defaults.headers.common['Authorization'] = VITE_ORDX_API_AUTHORIZATION;

export const generateUrl = (url: string) => {
    return `${VITE_API_HOST}/${VITE_BTC_CHAIN}/${url}`;
};

const getAppVersion = async (): Promise<string> => {
    const { data } = await axios.get<string>(`/version.txt`);
    return data;
};

const getHealth = async (): Promise<HealthStatusResp> => {
    const { data } = await axios.get<HealthStatusResp>(generateUrl(`health`));
    return data;
};

const getBestHeight = async (): Promise<BestHeightResp> => {
    const { data } = await axios.get<BestHeightResp>(generateUrl(`bestheight`));
    return data;
};

const getBlockInfo = async (height): Promise<BlockInfoResp> => {
    const { data } = await axios.get<BlockInfoResp>(generateUrl(`height/${height}`));
    return data;
};

const getSatributeList = async (): Promise<SatributeListResp> => {
    const { data } = await axios.get<SatributeListResp>(generateUrl(`info/satributes`));
    return data;
};

const getSplittedSatNameList = async (ticker: string): Promise<SplittedSatNameListResp> => {
    const { data } = await axios.get<SplittedSatNameListResp>(generateUrl(`splittedInscriptions/${ticker}`));
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