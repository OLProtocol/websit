import axios from 'axios';
import { generateUrl } from './common';
import { IndexerLayer, SpecificSatListReq, SpecificSatListResp } from '../type';

export const getSpecificSat = async (param: SpecificSatListReq, indexerLayer = IndexerLayer.Base): Promise<SpecificSatListResp> => {
    const { data } = await axios.post<SpecificSatListResp>(generateUrl(`sat/FindSatsInAddress`, indexerLayer), param);
    return data;
};

const sat = {
    getSpecificSat
};
export default sat;