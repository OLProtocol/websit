import axios, { AxiosResponse } from 'axios';
import { generateUrl } from './common';
import { AbbrAssetListResp, AssetListResp, PlainUtxoListReq, PlainUtxoListResp } from '../type/utxo';
import { IndexerLayer } from '../type';


interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

const handleApiRequest = async <T>(requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>) => {
  try {
    const resp = await requestFn();
    if (resp.status !== 200) {
      throw new Error(`Failed to get data, status code: ${resp.status}`);
    }
    if (resp.data.code !== 0) {
      throw new Error(resp.data.msg);
    }
    return resp.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw error;
  }
};

const getPlainUtxoList = async (param: PlainUtxoListReq, indexerLayer = IndexerLayer.Base) => {
  const url = `utxo/address/${param.address}/${param.value}?start=${param.start}&limit=${param.limit}`;
  const { data } = await axios.get<PlainUtxoListResp>(generateUrl(url, indexerLayer));
  return data;
};

const getAbbrAssetList = async (utxo: string, indexerLayer = IndexerLayer.Base): Promise<AbbrAssetListResp> => {
  const url = `utxo/abbrassets/${utxo}`;
  return handleApiRequest(() => axios.get<ApiResponse<AbbrAssetListResp>>(generateUrl(url, indexerLayer)));
};


const getAssetList = async (utxo: string, indexerLayer = IndexerLayer.Base) => {
  const url = `utxo/assets/${utxo}`
  const { data } = await axios.get<AssetListResp>(generateUrl(url,indexerLayer));
  return data;
};

const utxo = {
  getAssetList,
  getAbbrAssetList,
  getPlainUtxoList
}
export default utxo;