import axios from 'axios';
import { ExoticSatInfoListResp, ExoticSatInfoResp, SpecificExoticAssetReq, SpecificExoticAssetResp } from '../type';
import { generateUrl, handleApiRequest } from './common';


const getSpecificExoticAsset = async (param: SpecificExoticAssetReq): Promise<SpecificExoticAssetResp> => {
    const url = `exotic/address/${param.address}/${param.type}`
    return handleApiRequest(() => axios.get<SpecificExoticAssetResp>(generateUrl(url)));
};

const getExoticSatInfo = async (utxo: string): Promise<ExoticSatInfoResp> => {
    const url = `exotic/utxo/${utxo}`
    return handleApiRequest(() => axios.get<ExoticSatInfoResp>(generateUrl(url)));
};


const getExoticSatInfoList = async ({ address }: any): Promise<ExoticSatInfoListResp> => {
    const url = `exotic/address/${address}`
    return handleApiRequest(() => axios.get<ExoticSatInfoListResp>(generateUrl(url)));
};

const exotic = {
    getSpecificExoticAsset,
    getExoticSatInfo,
    getExoticSatInfoList
}

export default exotic;