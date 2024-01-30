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
  }/${url}`;
};
const { VITE_API_HOST } = import.meta.env;
export const responseParse = async (response) => {
  const { code, msg, data } = response?.data || {};
  if (code === 0) {
    return response?.data;
  } else {
    console.log('error: ' + msg);
  }
};
export const getOrdxStatusList = async (
  params: Ord2ListStatusParams,
): Promise<any> => {
  const { data } = await axios.get(
    generateUrl(
      `v1/indexer/ordx/status?start=${params.start}&limit=${params.limit}`,
      params.network,
    ),
  );
  return data;
};

export const getOrdxInfo = async ({ tick, network }: Ord2InfoParams) => {
  const { data } = await axios.get(
    generateUrl(`v1/indexer/ordx/${tick}/info`, network),
    {
      timeout: 10000,
    },
  );
  return data;
};

export const getOrdxSummary = async ({
  address,
  network,
}: OrdXSummaryParams) => {
  const { data } = await axios.get(
    generateUrl(`query-v4/address/${address}/ordx/summary`, network),
  );
  return data;
};
export const getOrdxTickHolders = async ({
  tick,
  network,
}: Ord2InfoParams) => {
  const { data } = await axios.get(
    generateUrl(`v1/indexer/ordx/${tick}/holders`, network),
  );
  return data;
};

export const getOrdxAddressHistory = async ({
  address,
  ticker,
  network,
  start,
  limit,
}: OrdXHistoryParams) => {
  console.log('getOrdxAddressHistory', address, ticker, network )
  const { data } = await axios.get(
    generateUrl(`query-v4/address/${address}/ordx/${ticker}/history?start=${start}&limit=${limit}`, network),
  );
  return data;
};
export const getOrdxTickHistory = async ({
  start,
  limit,
  ticker,
  network,
}: OrdXHistoryParams) => {
  const { data } = await axios.get(
    generateUrl(`query-v4/ordx/${ticker}/history?start=${start}&limit=${limit}`, network),
  );
  return data;
};

export const getOrdxHistoryDetail = async ({
  address,
  ticker,
  network,
  start,
  limit,
}: OrdXHistoryDetailParams) => {
  const { data } = await axios.get(
    generateUrl(
      `query-v4/address/${address}/ordx/${ticker}/history?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};

export const getAvailableUtxos = async ({
  address,
  ticker,
  network,
}: any) => {
  const { data } = await axios.get(
    generateUrl(
      `query-v4/address/${address}/ordx/${ticker}/getAvailableUtxo`,
      network,
    ),
  );
  return data;
};
export const getCurrentHeight = async ({
  network,
}: OrdXHistoryParams) => {
  const { data } = await axios.get(
    generateUrl(
      `v1/indexer/ordx/bestheight`,
      network,
    ),
  );
  return data;
};
