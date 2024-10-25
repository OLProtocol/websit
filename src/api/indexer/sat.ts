import axios from 'axios';
import { generateUrl } from './common';
import { SpecificSatListReq, SpecificSatListResp } from '../type';

export const getSpecificSat = async (param: SpecificSatListReq): Promise<SpecificSatListResp> => {
    const { data } = await axios.post<SpecificSatListResp>(generateUrl(`sat/FindSatsInAddress`), param);
    return data;
};

const sat = {
    getSpecificSat
};
export default sat;