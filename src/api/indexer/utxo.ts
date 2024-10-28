import axios from 'axios';
import { ApiResponse, generateUrl, handleApiRequest } from './common';
import { AbbrAssetListResp, AssetListResp, PlainUtxoListReq, PlainUtxoListResp } from '../type/utxo';
import { IndexerLayer } from '../type';

const getPlainUtxoList = async (param: PlainUtxoListReq, indexerLayer = IndexerLayer.Base) => {
  const url = `utxo/address/${param.address}/${param.value}?start=${param.start}&limit=${param.limit}`;
  return handleApiRequest(() => axios.get<PlainUtxoListResp>(generateUrl(url, indexerLayer)));
};

const getAbbrAssetList = async (utxo: string, indexerLayer = IndexerLayer.Base): Promise<AbbrAssetListResp> => {
  const url = `utxo/abbrassets/${utxo}`;
  return handleApiRequest(() => axios.get<AbbrAssetListResp>(generateUrl(url, indexerLayer)));
};

const getAssetList = async (utxo: string, indexerLayer = IndexerLayer.Base) => {
  const url = `utxo/assets/${utxo}`
  return handleApiRequest(() => axios.get<AssetListResp>(generateUrl(url, indexerLayer)));
};

const utxo = {
  getAssetList,
  getAbbrAssetList,
  getPlainUtxoList
}
export default utxo;