import axios from 'axios';
import {
  Ord2ListStatusParams,
  Ord2InfoParams,
  OrdXSummaryParams,
  OrdXHistoryParams,
  TxStatusParams,
} from './types';

export const generateUrl = (url: string, network?: string) => {
  return `${VITE_API_HOST}${network === 'testnet' ? '/testnet' : '/mainnet'}/${url}`;
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
      // `status?start=${params.start}&limit=${params.limit}`,
      `tick/status?start=${params.start}&limit=${params.limit}`,
      params.network,
    ),
  );
  return data;
};

export const health = async ({ network }) => {
  const { data } = await axios.get(generateUrl(`health`, network));
  return data;
};

export const getOrdxInfo = async ({ tick, network }: Ord2InfoParams) => {
  const { data } = await axios.get(
    // generateUrl(`v1/indexer/ordx/${tick}/info`, network),
    generateUrl(`tick/info/${tick}`, network),
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
    // generateUrl(`query-v4/address/${address}/ordx/summary`, network),
    generateUrl(`address/summary/${address}`, network),
  );
  return data;
};
export const getOrdxTickHolders = async ({ tick, network, start, limit }) => {
  const { data } = await axios.get(
    generateUrl(`tick/holders/${tick}?start=${start}&limit=${limit}`, network),
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
      // `query-v4/address/${address}/ordx/${ticker}/history?start=${start}&limit=${limit}`,
      `address/history/${address}/${ticker}?start=${start}&limit=${limit}`,
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
      // `query-v4/address/${address}/ordx/${ticker}/holderlist?start=${start}&limit=${limit}`,
      `address/utxolist/${address}/${ticker}?start=${start}&limit=${limit}`,
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
      // `query-v4/ordx/${ticker}?start=${start}&limit=${limit}`,
      `tick/history/${ticker}?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};

export const getUtxoByValue = async ({
  address,
  value = 600,
  network,
}: any) => {
  const { data } = await axios.get(
    generateUrl(`utxo/address/${address}/${value}`, network),
  );
  return data;
};

// server端无此接口
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

export const getInscriptiontInfo = async ({ inscriptionId, network }: any) => {
  const { data } = await axios.get(
    generateUrl(`mint/details/${inscriptionId}`, network),
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

export const getSats = async ({ address, network }: any) => {
  const { data } = await axios.get(
    generateUrl(`exotic/address/${address}`, network),
  );
  return data;
};

export const getSplittedSats = async ({ ticker, network }: any) => {
  const { data } = await axios.get(
    // generateUrl(`v1/indexer/ordx/${ticker}/splittedInscriptions`, network),
    generateUrl(`splittedInscriptions/${ticker}`, network),
  );
  return data;
};

export const getAssetByUtxo = async ({ utxo, network }: any) => {
  const { data } = await axios.get(
    generateUrl(`utxo/abbrassets/${utxo}`, network),
  );
  return data;
};
export const getSeedByUtxo = async ({ utxo, network }: any) => {
  const { data } = await axios.get(generateUrl(`utxo/seed/${utxo}`, network));
  return data;
};

export const getUtxoByType = async ({ address, type, network }: any) => {
  const { data } = await axios.get(
    generateUrl(`exotic/address/${address}/${type}`, network),
  );
  return data;
};

export const getSatsByAddress = async ({ address, sats, network }: any) => {
  const { data } = await axios.post(
    generateUrl(`sat/FindSatsInAddress`, network),
    {
      address: address,
      sats: sats,
    },
  );
  return data;
};

export const getSatsByUtxo = async ({ utxo, network }: any) => {
  const { data } = await axios.get(generateUrl(`exotic/utxo/${utxo}`, network));
  return data;
};

export const getSatTypes = async ({ network }: any) => {
  const { data } = await axios.get(generateUrl(`info/satributes`, network));
  return data;
};

export const getUtxo = async ({ utxo, network }: any) => {
  const { data } = await axios.get(generateUrl(`utxo/assets/${utxo}`, network));
  return data;
};
export const exoticUtxo = async ({ utxo, network }: any) => {
  console.log(utxo);
  const { data } = await axios.get(
    // generateUrl(`v1/indexer/ordx/${tick}/info`, network),
    generateUrl(`exotic/utxo/${utxo}`, network),
    {
      timeout: 10000,
    },
  );
  return data;
};

export const getOrdInscriptionsByAddress = async ({
  address,
  network,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(
    generateUrl(
      `inscription/address/${address}?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};

export const getOrdInscriptionsByGenesesAddress = async ({
  address,
  network,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(
    generateUrl(
      `inscription/genesesaddress/${address}?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};

export const getOrdInscriptionsBySat = async ({
  sat,
  network,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(
    generateUrl(
      `inscription/sat/${sat}?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};

export const getOrdInscription = async ({ inscriptionId, network }: any) => {
  const { data } = await axios.get(
    generateUrl(`inscription/id/${inscriptionId}`, network),
  );
  return data;
};
export const getNsList = async ({ network }: any) => {
  const { data } = await axios.get(generateUrl(`ns/status`, network));
  return data;
};
export const getNsName = async ({ name, network }: any) => {
  const { data } = await axios.get(generateUrl(`ns/name/${name}`, network));
  return data;
};

export const getInscriptionsByAddress = async ({
  address,
  network,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(
    generateUrl(
      `inscription/address/${address}?start=${start}&limit=${limit}`,
      network,
    ),
  );
  return data;
};

export const getInscriptionsByGenesesAddress = async ({
  address,
  network,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(
    generateUrl(
      `inscription/genesesaddress/${address}?start=${start}&limit=${limit}`,
      network,
    ),
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
