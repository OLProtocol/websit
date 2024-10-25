import axios, { AxiosResponse } from 'axios';
import { generateUrl } from './common';
import { AbbrAssetListResp, AssetListResp, PlainUtxoListReq, PlainUtxoListResp } from '../type/utxo';


interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

const handleApiRequest = async <T>(requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>) => {
  try {
    const resp = await requestFn();
    if (resp.status !== 200) {
      throw new Error(`API request failed, HTTP status code: ${resp.status}`);
    }
    if (resp.data.code !== 0) {
      throw new Error(`API request failed, code: ${resp.data.code}, msg: ${resp.data.msg}`);
    }
    return resp.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed, axios error: ${error.message}`);
    }
    throw error;
  }
};

const getPlainUtxoList = async (param: PlainUtxoListReq) => {
  const url = `utxo/address/${param.address}/${param.value}?start=${param.start}&limit=${param.limit}`;
  return handleApiRequest(() => axios.get<ApiResponse<PlainUtxoListResp>>(generateUrl(url)));
};

const getAbbrAssetList = async (utxo: string): Promise<AbbrAssetListResp> => {
  const url = `utxo/abbrassets/${utxo}`;
  return handleApiRequest(() => axios.get<ApiResponse<AbbrAssetListResp>>(generateUrl(url)));
};


const getAssetList = async (utxo: string) => {
  const url = `utxo/assets/${utxo}`
  return handleApiRequest(() => axios.get<ApiResponse<AssetListResp>>(generateUrl(url)));
};

const utxo = {
  getAssetList,
  getAbbrAssetList,
  getPlainUtxoList
}
export default utxo;