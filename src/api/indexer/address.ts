import axios from 'axios';
import { AssetsSummaryReq, UtxoListReq, UtxoListResp, AssetsSummaryResp, MintHistoryReq, MintHistoryResp, IndexerLayer } from '../type';
import { generateUrl } from './common';

const getAssetsSummary = async (param: AssetsSummaryReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<AssetsSummaryResp> => {
    const { data } = await axios.get<AssetsSummaryResp>(generateUrl(`address/summary/${param.address}?start=${param.start}&limit=${param.limit}`,indexerLayer));
    return data;
};

const getMintHistory = async (param: MintHistoryReq, indexerLayer: IndexerLayer = IndexerLayer.Base) : Promise<MintHistoryResp> => {
    const url = `address/history/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`
    const { data } = await axios.get<MintHistoryResp>(generateUrl(url, indexerLayer));
    return data;
};

const getUtxoList = async (param: UtxoListReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<UtxoListResp> => {
    const url = `address/utxolist/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`
    const { data } = await axios.get(generateUrl(url, indexerLayer));
    return data;
};

const address = {
    getAssetsSummary,
    getMintHistory,
    getUtxoList,
};

export default address;
