import axios from 'axios';
import { AssetsSummaryReq, UtxoListReq, UtxoListResp, AssetsSummaryResp, MintHistoryReq, MintHistoryResp } from '../type';
import { generateUrl, handleApiRequest } from './common';

const getAssetsSummary = async (param: AssetsSummaryReq): Promise<AssetsSummaryResp> => {
    const url = `address/summary/${param.address}?start=${param.start}&limit=${param.limit}`
    return handleApiRequest(() => axios.get<AssetsSummaryResp>(generateUrl(url)));
};

const getMintHistory = async (param: MintHistoryReq) : Promise<MintHistoryResp> => {
    const url = `address/history/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<MintHistoryResp>(generateUrl(url)));
};

const getUtxoList = async (param: UtxoListReq): Promise<UtxoListResp> => {
    const url = `address/utxolist/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<UtxoListResp>(generateUrl(url)));
};

const address = {
    getAssetsSummary,
    getMintHistory,
    getUtxoList,
};

export default address;
