import axios from 'axios';
import {
    NameStatusListReq,
    NameListResp,
    NameStatusListResp,
    NameListReq,
    NameResp,
    IndexerLayer,
} from '../type';

import { generateUrl } from './common';

export const getNameStatusList = async (param: NameStatusListReq, indexerLayer = IndexerLayer.Base) :Promise<NameStatusListResp> => {
    
    const url = `ns/status?start=${param.start}&limit=${param.limit}`;
    const { data } = await axios.get<NameStatusListResp>(generateUrl(url, indexerLayer));
    return data;
};

export const getNameList = async (param: NameListReq, indexerLayer = IndexerLayer.Base): Promise<NameListResp> => {
    const url = `ns/address/${param.address}?start=${param.start}&limit=${param.limit}`
    const { data } = await axios.get<NameListResp>(generateUrl(url,indexerLayer));
    return data;
};

export const getName = async (name: string, indexerLayer = IndexerLayer.Base): Promise<NameResp> => {
    const url = `ns/name/${name}`
    const { data } = await axios.get<NameResp>(generateUrl(url, indexerLayer));
    return data;
};

const ns = {
    getNameStatusList,
    getNameList,
    getName,
};

export default ns;