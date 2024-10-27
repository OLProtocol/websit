import axios from 'axios';
import {
    TickerStatusReq,
    TickerStatusResp,
    MintHistoryReq,
    MintHistoryResp,
    TickerStatusListReq,
    TickerStatusListResp,
    TickerHolderReq,
    TickerHolderResp,
} from '../type';
import { ApiResponse, generateUrl, handleApiRequest } from './common';

export const getStatus = async (param: TickerStatusReq): Promise<TickerStatusResp> => {
    const url = `tick/info/${param.ticker}`;
    return handleApiRequest(() => axios.get<TickerStatusResp>(generateUrl(url)));
};

export const getStatusList = async (param: TickerStatusListReq): Promise<TickerStatusListResp> => {
    const url = `tick/status?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<TickerStatusListResp>(generateUrl(url)));
};

export const getHolderList = async (param: TickerHolderReq): Promise<TickerHolderResp> => {
    const url = `tick/holders/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<TickerHolderResp>(generateUrl(url)));
};

export const getMintHistory = async (param: MintHistoryReq): Promise<MintHistoryResp> => {
    const url = `tick/history/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<MintHistoryResp>(generateUrl(url)));
};

const tick = {
    getStatus,
    getStatusList,
    getHolderList,
    getMintHistory,
};
export default tick;