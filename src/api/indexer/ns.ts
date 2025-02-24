import axios from 'axios';
import {
    NameStatusListReq,
    NameListResp,
    NameStatusListResp,
    NameListReq,
    NameResp,
    IndexerLayer,
} from '../type';

import { generateUrl, handleApiRequest } from './common';

export const getNameStatusList = async (param: NameStatusListReq, indexerLayer: IndexerLayer = IndexerLayer.Base) :Promise<NameStatusListResp> => {
    const url = `ns/status?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<NameStatusListResp>(generateUrl(url, indexerLayer)));
};

export const getNameList = async (param: NameListReq, indexerLayer = IndexerLayer.Base): Promise<NameListResp> => {
    const url = `ns/address/${param.address}?start=${param.start}&limit=${param.limit}`
    const ret = handleApiRequest(() => axios.get<NameListResp>(generateUrl(url, indexerLayer)));
    return ret
};

export const getName = async (name: string, indexerLayer = IndexerLayer.Base): Promise<NameResp> => {
    const url = `ns/name/${name}`
    return handleApiRequest(() => axios.get<NameResp>(generateUrl(url, indexerLayer)));
};

const ns = {
    getNameStatusList,
    getNameList,
    getName,
};

export default ns;