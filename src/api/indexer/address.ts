import axios from 'axios';
import { AddressAssetsSummaryReq, UtxoListReq, UtxoListResp, AddressAssetsSummaryResp, MintHistoryReq, MintHistoryResp, IndexerLayer } from '../type';
import { generateUrl, handleApiRequest } from './common';

const getAssetsSummary = async (param: AddressAssetsSummaryReq, indexerLayer: IndexerLayer): Promise<AddressAssetsSummaryResp> => {
    const url = `v3/address/summary/${param.address}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<AddressAssetsSummaryResp>(generateUrl(url, indexerLayer)));
};

const getMintHistory = async (param: MintHistoryReq, indexerLayer: IndexerLayer = IndexerLayer.Base) : Promise<MintHistoryResp> => {
    const url = `address/history/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<MintHistoryResp>(generateUrl(url, indexerLayer)));
};

const getUtxoList = async (param: UtxoListReq, indexerLayer: IndexerLayer = IndexerLayer.Base): Promise<UtxoListResp> => {
    const url = `address/utxolist/${param.address}/${param.ticker}?start=${param.start}&limit=${param.limit}`;
    return handleApiRequest(() => axios.get<UtxoListResp>(generateUrl(url, indexerLayer)));
};

const address = {
    getAssetsSummary,
    getMintHistory,
    getUtxoList,
};

export default address;
