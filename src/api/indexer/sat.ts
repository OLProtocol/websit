import axios from 'axios';
import { ApiResponse, generateUrl, handleApiRequest } from './common';
import { SpecificSatListReq, SpecificSatListResp } from '../type';

export const getSpecificSat = async (param: SpecificSatListReq): Promise<SpecificSatListResp> => {
    let url = `sat/FindSatsInAddress?start=${param.address}&sats=${param.sats[0]}`;
    return handleApiRequest(() => axios.post<SpecificSatListResp>(generateUrl(url),param));
};

const sat = {
    getSpecificSat
};
export default sat;