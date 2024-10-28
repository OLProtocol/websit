import axios from 'axios';
import {
  IndexerLayer,
  NftDetailResp,
  NftListReq,
  NftListResp,
  NftStatusListReq,
  NftStatusListResp,
} from '../type';

import { generateUrl, handleApiRequest } from './common';

export const getNftStatusList = async (param: NftStatusListReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<NftStatusListResp> => {
    const url = `nft/status?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<NftStatusListResp>(generateUrl(url, indexerLayer)));
};

export const getNftListWithAddress = async (param: NftListReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<NftListResp> => {
    const url = `nft/address/${param.address}?start=${param.start}&limit=${param.limit}`
    return handleApiRequest(() => axios.get<NftListResp>(generateUrl(url, indexerLayer)));
  };
  
  export const getNftListWithSat = async (param: NftListReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<NftListResp> => {
    const url = `nft/sat/${param.sat}?start=${param.start}&limit=${param.limit}`
    return handleApiRequest(() => axios.get<NftListResp>(generateUrl(url, indexerLayer)));
  };
  
  export const getNftDetail = async ( inscriptionId : string, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<NftDetailResp> => {
    const url = `nft/nftid/${inscriptionId}`
    return handleApiRequest(() => axios.get<NftDetailResp>(generateUrl(url, indexerLayer)));
  };

const nft = {
  getNftStatusList,
  getNftListWithAddress,
  getNftListWithSat,
  getNftDetail
}
export default nft;