import axios from 'axios';
import {
  Ord2ListStatusParams,
  Ord2InfoParams,
  OrdXSummaryParams,
  OrdXHistoryParams,
  OrdXHistoryDetailParams,
} from './types';
export const generateUrl = (url: string, network?: string) => {
  return `${VITE_API_HOST}${
    network === 'testnet' ? '/testnet' : ''
  }/ordx/${url}`;
};
const { VITE_API_HOST } = import.meta.env;
export const responseParse = async (response) => {
  const { code, msg, data } = response?.data || {};
  console.log('code', code);
  console.log('data', data);
  if (code === 0) {
    return response?.data;
  } else {
    console.log('error: ' + msg);
  }
};
export const getOrdxStatusList = async (
  params: Ord2ListStatusParams,
): Promise<any> => {
  const { data } = await axios
    .get(
      generateUrl(
        `v1/indexer/ordx/status?start=${params.start}&limit=${params.limit}`,
        params.network,
      ),
    )
    .then(responseParse);
  return data;
};

export const getOrdxInfo = async ({ tick, network }: Ord2InfoParams) => {
  const { data } = await axios
    .get(generateUrl(`v1/indexer/ordx/${tick}/info`, network), {
      timeout: 10000,
    })
    .then(responseParse);
  return data;
};

export const getOrdxSummary = async ({
  address,
  network,
}: OrdXSummaryParams) => {
  const { data } = await axios
    .get(generateUrl(`query-v4/address/${address}/ordx/summary`, network))
    .then(responseParse);
  return data;
};

export const getOrdxHistory = async ({
  address,
  ticker,
  network,
}: OrdXHistoryParams) => {
  const { data } = await axios
    .get(
      generateUrl(
        `query-v4/address/${address}/ordx/${ticker}/summary`,
        network,
      ),
    )
    .then(responseParse);
  return data;
};

export const getOrdxHistoryDetail = async ({
  address,
  ticker,
  network,
  start,
  limit,
}: OrdXHistoryDetailParams) => {
  const { data } = await axios
    .get(
      generateUrl(
        `query-v4/address/${address}/ordx/${ticker}/history?start=${start}&limit=${limit}`,
        network,
      ),
    )
    .then(responseParse);
  return data;
};

export const getAvailableUtxos = async ({
  address,
  ticker,
  network,
}: OrdXHistoryParams) => {
  const { data } = await axios
    .get(
      generateUrl(
        `query-v4/address/${address}/ordx/${ticker}/getAvailableUtxo`,
        network,
      ),
    )
    .then(responseParse);
  return data;
};
