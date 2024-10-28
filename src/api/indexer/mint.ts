import axios from 'axios';
import { generateUrl, handleApiRequest } from './common';
import { IndexerLayer, MintDetailInfoResp } from '../type';

export const getMintDetailInfo = async (inscriptionId : string, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<MintDetailInfoResp> => {
  const url = `mint/details/${inscriptionId}`
  return handleApiRequest(() => axios.get<MintDetailInfoResp>(generateUrl(url, indexerLayer)));
};

const mint = {
  getMintDetailInfo
};
export default mint;