import axios from 'axios';
import { AssetsSummaryReq, UtxoListReq, UtxoListResp, AssetsSummaryResp, MintHistoryReq, MintHistoryResp } from '../type';
import { generateUrl } from './common';

const getAssetsSummary = async (param: AssetsSummaryReq): Promise<AssetsSummaryResp> => {
    const { data } = await axios.get<AssetsSummaryResp>(generateUrl(`address/summary/${param.address}?start=${param.start}&limit=${param.limit}`));
    return data;
};

const getMintHistory = async (param: MintHistoryReq) : Promise<MintHistoryResp> => {
    const { data } = await axios.get<MintHistoryResp>(generateUrl(`address/history/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`));
    return data;
};

const getUtxoList = async (param: UtxoListReq): Promise<UtxoListResp> => {
    const { data } = await axios.get(generateUrl(`address/utxolist/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`));
    return data;
};

const address = {
    getAssetsSummary,
    getMintHistory,
    getUtxoList,
};

export default address;
