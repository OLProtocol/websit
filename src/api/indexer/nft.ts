import axios from 'axios';
import {
    NftDetailResp,
    NftListReq,
    NftListResp,
    NftStatusListReq,
    NftStatusListResp,
} from '../type';

import { generateUrl } from './common';



export const getNftStatusList = async (param: NftStatusListReq): Promise<NftStatusListResp> => {
    const { data } = await axios.get<NftStatusListResp>(generateUrl(`nft/status?start=${param.start}&limit=${param.limit}`));
    return data;
};

export const getNftListWithAddress = async (param: NftListReq): Promise<NftListResp> => {
    const { data } = await axios.get<NftListResp>(generateUrl(`nft/address/${param.address}?start=${param.start}&limit=${param.limit}`));
    return data;
  };
  
  export const getNftListWithSat = async (param: NftListReq): Promise<NftListResp> => {
    const { data } = await axios.get<NftListResp>(generateUrl(`nft/sat/${param.sat}?start=${param.start}&limit=${param.limit}`));
    return data;
  };
  
  export const getNftDetail = async ( inscriptionId : string): Promise<NftDetailResp> => {
    const { data } = await axios.get<NftDetailResp>(generateUrl(`nft/nftid/${inscriptionId}`));
    return data;
  };

const nft = {
  getNftStatusList,
  getNftListWithAddress,
  getNftListWithSat,
  getOrdInscription: getNftDetail
}
export default nft;