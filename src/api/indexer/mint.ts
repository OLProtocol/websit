import axios from 'axios';
import { generateUrl } from './common';
import { IndexerLayer, MintDetailInfoResp } from '../type';

export const getMintDetailInfo = async (inscriptionId: string, indexerLayer = IndexerLayer.Base): Promise<MintDetailInfoResp> => {
  const { data } = await axios.get<MintDetailInfoResp>(generateUrl(`mint/details/${inscriptionId}`, indexerLayer));
  return data;
};

const mint = {
  getMintDetailInfo
};
export default mint;