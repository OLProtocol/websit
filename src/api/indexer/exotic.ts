import axios from 'axios';
import { ExoticSatInfoListResp, ExoticSatInfoResp, IndexerLayer, SpecificExoticAssetReq, SpecificExoticAssetResp } from '../type';
import { generateUrl } from './common';


const getSpecificExoticAsset = async (param: SpecificExoticAssetReq, indexerLayer = IndexerLayer.Base): Promise<SpecificExoticAssetResp> => {
    const { data } = await axios.get<SpecificExoticAssetResp>(generateUrl(`exotic/address/${param.address}/${param.type}`, indexerLayer));
    return data;
};

const getExoticSatInfo = async (utxo: string, indexerLayer = IndexerLayer.Base): Promise<ExoticSatInfoResp> => {
    const { data } = await axios.get<ExoticSatInfoResp>(generateUrl(`exotic/utxo/${utxo}`, indexerLayer));
    return data;
};


const getExoticSatInfoList = async ({ address }: any, indexerLayer = IndexerLayer.Base): Promise<ExoticSatInfoListResp> => {
    const { data } = await axios.get<ExoticSatInfoListResp>(generateUrl(`exotic/address/${address}`, indexerLayer));
    return data;
};

const exotic = {
    getSpecificExoticAsset,
    getExoticSatInfo,
    getExoticSatInfoList
}

export default exotic;