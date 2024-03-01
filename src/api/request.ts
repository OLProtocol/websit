import axios from 'axios';
import {
  Ord2ListStatusParams,
  Ord2InfoParams,
  OrdXSummaryParams,
  OrdXHistoryParams,
  OrdXHistoryDetailParams,
  TxStatusParams,
} from './types';
export const generateUrl = (url: string, network?: string) => {
  return `${VITE_API_HOST}${network === 'testnet' ? '/testnet' : ''}/${url}`;
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
export const getOrdxTickHolders = async ({ tick, network }: Ord2InfoParams) => {
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
  const { data } = await axios.get(
    generateUrl(
      `query-v4/address/${address}/ordx/${ticker}/history?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};
export const getOrdxAddressHolders = async ({
  address,
  ticker,
  network,
  start,
  limit,
}: OrdXHistoryParams) => {
  const { data } = await axios.get(
    generateUrl(
      `query-v4/address/${address}/ordx/${ticker}/heldlist?start=${start}&limit=${limit}`,
      network,
    ),
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
    generateUrl(
      `query-v4/ordx/${ticker}/history?start=${start}&limit=${limit}`,
      network,
    ),
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

export const getAvailableUtxos = async ({ address, ticker, network }: any) => {
  const { data } = await axios.get(
    generateUrl(
      `query-v4/address/${address}/ordx/${ticker}/getAvailableUtxo`,
      network,
    ),
  );
  return data;
};
export const getCurrentHeight = async ({ network }: any) => {
  const { data } = await axios.get(
    generateUrl(`v1/indexer/ordx/bestheight`, network),
  );
  return data;
};
export const savePaidOrder = async ({ key, content, network }: any) => {
  const { data } = await axios.post(
    generateUrl(`v1/indexer/tx/putkv/${key}`, network),
    {
      key,
      content: JSON.stringify(content),
    },
  );
  return data;
};
export const getMintInfo = async ({ inscribId }: any) => {
  const { data } = await axios.get(
    generateUrl(`v1/indexer/inscription/${inscribId}/mintinfo`, inscribId),
  );
  return data;
};
export const getAppVersion = async () => {
  const { data } = await axios.get(`/version.txt`);
  return data;
};
export const getTxStatus = async ({ txid, network }: TxStatusParams) => {
  const { data } = await axios.get(
    `https://blockstream.info/${
      network === 'testnet' ? 'testnet/' : ''
    }api/tx/${txid}`,
  );
  return data;
};


export async function pollGetTxStatus(
  txid: string,
  network: string,
  delay = 2000,
  retryCount = 30,
) {
  try {
    const result = await getTxStatus({ txid, network });
    if (result?.status) {
      console.log('getTxStatus succeeded, stopping poll.');
      console.log(result);
      return result;
    } else if (retryCount > 0) {
      console.log('getTxStatus returned no result, retrying...');
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(pollGetTxStatus(txid, network, delay, retryCount - 1)),
          delay,
        );
      });
    } else {
      throw new Error('Maximum retry attempts exceeded');
    }
  } catch (error) {
    if (retryCount > 0) {
      console.error('getTxStatus failed, retrying...');
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(pollGetTxStatus(txid, network, delay, retryCount - 1)),
          delay,
        );
      });
    } else {
      throw new Error('Maximum retry attempts exceeded');
    }
  }
}