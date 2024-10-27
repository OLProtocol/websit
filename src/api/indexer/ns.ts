import axios from 'axios';
import {
    NameStatusListReq,
    NameListResp,
    NameStatusListResp,
    NameListReq,
    NameResp,
} from '../type';

import { generateUrl, handleApiRequest } from './common';

export const getNameStatusList = async (param: NameStatusListReq) :Promise<NameStatusListResp> => {
    const url = `ns/status?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<NameStatusListResp>(generateUrl(url)));
};

export const getNameList = async (param: NameListReq): Promise<NameListResp> => {
    const url = `ns/address/${param.address}?start=${param.start}&limit=${param.limit}`
    return handleApiRequest(() => axios.get<NameListResp>(generateUrl(url)));
};

export const getName = async (name: string): Promise<NameResp> => {
    const url = `ns/name/${name}`
    return handleApiRequest(() => axios.get<NameResp>(generateUrl(url)));
};

const ns = {
    getNameStatusList,
    getNameList,
    getName,
};

export default ns;