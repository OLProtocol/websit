import axios from 'axios';
import {
    NftDetailResp,
    NftListReq,
    NftListResp,
    NftStatusListReq,
    NftStatusListResp,
} from '../type';

import { generateUrl, handleApiRequest } from './common';



export const getNftStatusList = async (param: NftStatusListReq): Promise<NftStatusListResp> => {
    const url = `nft/status?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<NftStatusListResp>(generateUrl(url)));
};

export const getNftListWithAddress = async (param: NftListReq): Promise<NftListResp> => {
    const url = `nft/address/${param.address}?start=${param.start}&limit=${param.limit}`
    return handleApiRequest(() => axios.get<NftListResp>(generateUrl(url)));
  };
  
  export const getNftListWithSat = async (param: NftListReq): Promise<NftListResp> => {
    const url = `nft/sat/${param.sat}?start=${param.start}&limit=${param.limit}`
    return handleApiRequest(() => axios.get<NftListResp>(generateUrl(url)));
  };
  
  export const getNftDetail = async ( inscriptionId : string): Promise<NftDetailResp> => {
    const url = `nft/nftid/${inscriptionId}`
    return handleApiRequest(() => axios.get<NftDetailResp>(generateUrl(url)));
  };

const nft = {
  getNftStatusList,
  getNftListWithAddress,
  getNftListWithSat,
  getNftDetail
}
export default nft;