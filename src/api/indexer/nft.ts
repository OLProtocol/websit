import axios from 'axios';
import {
  IndexerLayer,
  NftDetailResp,
  NftListReq,
  NftListResp,
  NftStatusListReq,
  NftStatusListResp,
} from '../type';
import { generateUrl } from './common';

export const getNftStatusList = async (param: NftStatusListReq, indexerLayer = IndexerLayer.Base): Promise<NftStatusListResp> => {
  const { data } = await axios.get<NftStatusListResp>(generateUrl(`nft/status?start=${param.start}&limit=${param.limit}`, indexerLayer));
  return data;
};

export const getNftListWithAddress = async (param: NftListReq, indexerLayer = IndexerLayer.Base,): Promise<NftListResp> => {
  const { data } = await axios.get<NftListResp>(generateUrl(`nft/address/${param.address}?start=${param.start}&limit=${param.limit}`, indexerLayer));
  return data;
};

export const getNftListWithSat = async (param: NftListReq, indexerLayer = IndexerLayer.Base): Promise<NftListResp> => {
  const { data } = await axios.get<NftListResp>(generateUrl(`nft/sat/${param.sat}?start=${param.start}&limit=${param.limit}`, indexerLayer));
  return data;
};

export const getNftDetail = async (inscriptionId: string, indexerLayer = IndexerLayer.Base): Promise<NftDetailResp> => {
  const { data } = await axios.get<NftDetailResp>(generateUrl(`nft/nftid/${inscriptionId}`, indexerLayer));
  return data;
};

const nft = {
  getNftStatusList,
  getNftListWithAddress,
  getNftListWithSat,
  getOrdInscription: getNftDetail
}
export default nft;