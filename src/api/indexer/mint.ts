import axios from 'axios';
import { generateUrl, handleApiRequest } from './common';
import { MintDetailInfoResp } from '../type';

export const getMintDetailInfo = async (inscriptionId : string): Promise<MintDetailInfoResp> => {
  const url = `mint/details/${inscriptionId}`
  return handleApiRequest(() => axios.get<MintDetailInfoResp>(generateUrl(url)));
};

const mint = {
  getMintDetailInfo
};
export default mint;