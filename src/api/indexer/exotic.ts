import axios from 'axios';
import { ExoticSatInfoListResp, ExoticSatInfoResp, IndexerLayer, SpecificExoticAssetReq, SpecificExoticAssetResp } from '../type';
import { generateUrl, handleApiRequest } from './common';


const getSpecificExoticAsset = async (param: SpecificExoticAssetReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<SpecificExoticAssetResp> => {
    const url = `exotic/address/${param.address}/${param.type}`
    return handleApiRequest(() => axios.get<SpecificExoticAssetResp>(generateUrl(url, indexerLayer)));
};

const getExoticSatInfo = async (utxo: string, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<ExoticSatInfoResp> => {
    const url = `exotic/utxo/${utxo}`
    return handleApiRequest(() => axios.get<ExoticSatInfoResp>(generateUrl(url, indexerLayer)));
};


const getExoticSatInfoList = async ({ address }: any, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<ExoticSatInfoListResp> => {
    const url = `exotic/address/${address}`
    return handleApiRequest(() => axios.get<ExoticSatInfoListResp>(generateUrl(url, indexerLayer)));
};

const exotic = {
    getSpecificExoticAsset,
    getExoticSatInfo,
    getExoticSatInfoList
}

export default exotic;