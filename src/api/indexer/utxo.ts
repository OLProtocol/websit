import axios from 'axios';
import { ApiResponse, generateUrl, handleApiRequest } from './common';
import { AbbrAssetListResp, AssetListResp, PlainUtxoListReq, PlainUtxoListResp } from '../type/utxo';

const getPlainUtxoList = async (param: PlainUtxoListReq) => {
  const url = `utxo/address/${param.address}/${param.value}?start=${param.start}&limit=${param.limit}`;
  return handleApiRequest(() => axios.get<PlainUtxoListResp>(generateUrl(url)));
};

const getAbbrAssetList = async (utxo: string): Promise<AbbrAssetListResp> => {
  const url = `utxo/abbrassets/${utxo}`;
  return handleApiRequest(() => axios.get<AbbrAssetListResp>(generateUrl(url)));
};

const getAssetList = async (utxo: string) => {
  const url = `utxo/assets/${utxo}`
  return handleApiRequest(() => axios.get<AssetListResp>(generateUrl(url)));
};

const utxo = {
  getAssetList,
  getAbbrAssetList,
  getPlainUtxoList
}
export default utxo;