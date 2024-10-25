import axios from 'axios';
import { generateUrl } from './common';
import { MintDetailInfoResp } from '../type';

export const getMintDetailInfo = async (inscriptionId : string): Promise<MintDetailInfoResp> => {
  const { data } = await axios.get<MintDetailInfoResp>(generateUrl(`mint/details/${inscriptionId}`));
  return data;
};

const mint = {
  getMintDetailInfo
};
export default mint;