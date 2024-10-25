import axios from 'axios';
import { AssetsSummaryReq, ExoticSatInfoListResp, ExoticSatInfoResp, SpecificExoticAssetReq, SpecificExoticAssetResp } from '../type';
import { generateUrl } from './common';


const getSpecificExoticAsset = async (param: SpecificExoticAssetReq): Promise<SpecificExoticAssetResp> => {
    const { data } = await axios.get<SpecificExoticAssetResp>(generateUrl(`exotic/address/${param.address}/${param.type}`));
    return data;
};

const getExoticSatInfo = async (utxo: string): Promise<ExoticSatInfoResp> => {
    const { data } = await axios.get<ExoticSatInfoResp>(generateUrl(`exotic/utxo/${utxo}`));
    return data;
};


const getExoticSatInfoList = async ({ address }: any): Promise<ExoticSatInfoListResp> => {
    const { data } = await axios.get<ExoticSatInfoListResp>(generateUrl(`exotic/address/${address}`));
    return data;
};

const exotic = {
    getSpecificExoticAsset,
    getExoticSatInfo,
    getExoticSatInfoList
}

export default exotic;