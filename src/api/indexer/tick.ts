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
    IndexerLayer,
    TickerHolderRespV3,
    MintHistoryRespV3,
} from '../type';
import { generateUrl, handleApiRequest } from './common';

export const getStatus = async (param: TickerStatusReq, indexerLayer = IndexerLayer.Base): Promise<TickerStatusResp> => {
    const url = `tick/info/${param.ticker}`;
    return handleApiRequest(() => axios.get<TickerStatusResp>(generateUrl(url, indexerLayer)));
};

export const getStatusList = async (param: TickerStatusListReq, indexerLayer = IndexerLayer.Base): Promise<TickerStatusListResp> => {
    const url = `tick/status?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<TickerStatusListResp>(generateUrl(url, indexerLayer)));
};

export const getHolderList = async (param: TickerHolderReq, indexerLayer = IndexerLayer.Base): Promise<TickerHolderResp> => {
    const url = `tick/holders/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<TickerHolderResp>(generateUrl(url, indexerLayer)));
};

export const getMintHistory = async (param: MintHistoryReq, indexerLayer = IndexerLayer.Base): Promise<MintHistoryResp> => {
    const url = `tick/history/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<MintHistoryResp>(generateUrl(url, indexerLayer)));
};

export const getHolderListV3 = async (param: TickerHolderReq, indexerLayer = IndexerLayer.Base): Promise<TickerHolderRespV3> => {
    const url = `v3/tick/holders/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<TickerHolderRespV3>(generateUrl(url, indexerLayer)));
};

export const getMintHistoryV3 = async (param: MintHistoryReq, indexerLayer = IndexerLayer.Base): Promise<MintHistoryRespV3> => {
    const url = `v3/tick/history/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<MintHistoryRespV3>(generateUrl(url, indexerLayer)));
};

const tick = {
    getStatus,
    getStatusList,
    getHolderList,
    getMintHistory,
    getHolderListV3,
    getMintHistoryV3,
};
export default tick;