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
import { generateUrl } from './common';

export const getStatus = async (param: TickerStatusReq): Promise<TickerStatusResp> => {
    const url = `tick/info/${param.ticker}`;
    const { data } = await axios.get<TickerStatusResp>(generateUrl(url));
    return data;
};

export const getStatusList = async (param: TickerStatusListReq): Promise<TickerStatusListResp> => {
    const url = `tick/status?start=${param.start}&limit=${param.limit}`;
    const { data } = await axios.get<TickerStatusListResp>(generateUrl(url));
    return data;
};

export const getHolderList = async (param: TickerHolderReq): Promise<TickerHolderResp> => {
    const url = `tick/holders/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    const { data } = await axios.get<TickerHolderResp>(generateUrl(url));
    return data;
};

export const getMintHistory = async (param: MintHistoryReq): Promise<MintHistoryResp> => {
    const url = `tick/history/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    const { data } = await axios.get<MintHistoryResp>(generateUrl(url));
    return data;
};

const tick = {
    getStatusList,
    getStatus,
    getHolderList,
    getMintHistory,
};
export default tick;