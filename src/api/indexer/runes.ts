import axios from 'axios';
import {
    TickerReqV3,
    TickerRespV3,
    TickerListReqV3,
    TickerListRespV3,
    RuneReq,
    RuneResp,
    RuneListReq,
    RuneListResp,
    IndexerLayer,
} from '../type';

import { generateUrl, handleApiRequest, handleListApiRequest } from './common';

export const getTickerV3 = async (req: TickerReqV3, indexerLayer = IndexerLayer.Base): Promise<TickerRespV3> => {
    const url = `v3/tick/info/${req.Protocol}:${req.Type}:${req.Ticker}`
    return handleApiRequest(() => axios.get<TickerRespV3>(generateUrl(url, indexerLayer)));
};

export const getTickerListV3 = async (param: TickerListReqV3, indexerLayer = IndexerLayer.Base): Promise<TickerListRespV3> => {
    const url = `v3/tick/all/${param.protocol}?start=${param.start}&limit=${param.limit}`
    const ret = handleListApiRequest(() => axios.get<TickerListRespV3>(generateUrl(url, indexerLayer)));
    return ret
};


export const getRuneList = async (param: RuneListReq,indexerLayer = IndexerLayer.Base): Promise<RuneListResp> => {
    const req: TickerListReqV3 = { protocol: 'runes',start : param.start, limit: param.limit }
    const ret = getTickerListV3(req, indexerLayer)
    return ret
};

export const getRune = async (req: RuneReq, indexerLayer = IndexerLayer.Base): Promise<RuneResp> => {
    const ret = getTickerV3(req, indexerLayer)
    return ret
};

const runes = {
    getRuneList,
    getRune,
};

export default runes;