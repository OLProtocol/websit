import axios from 'axios';
import { AssetsSummaryReq, UtxoListReq, UtxoListResp, AssetsSummaryResp, MintHistoryReq, MintHistoryResp } from '../type';
import { generateUrl } from './common';

const getAssetsSummary = async (param: AssetsSummaryReq): Promise<AssetsSummaryResp> => {
    const url = `address/summary/${param.address}?start=${param.start}&limit=${param.limit}`
    const { data } = await axios.get<AssetsSummaryResp>(generateUrl(url));
    return data;
};

const getMintHistory = async (param: MintHistoryReq) : Promise<MintHistoryResp> => {
    const url = `address/history/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    const { data } = await axios.get<MintHistoryResp>(generateUrl(url));
    return data;
};

const getUtxoList = async (param: UtxoListReq): Promise<UtxoListResp> => {
    const url = `address/utxolist/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    const { data } = await axios.get(generateUrl(url));
    return data;
};

const address = {
    getAssetsSummary,
    getMintHistory,
    getUtxoList,
};

export default address;
