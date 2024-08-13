import { BtcNetwork } from './../types/common';
import axios from 'axios';
import {
  ListReq,
  TokenInfoReq,
  AddressReq,
  TokenReq as TokenReq,
  TxStatusParams,
  TokenBalanceSummaryListResp,
  AddressListReq,
  NameListResp,
} from './types';
const { VITE_API_HOST, VITE_BTC_CHAIN } = import.meta.env;

export const generateUrl = (url: string) => {
  return `${VITE_API_HOST}/${VITE_BTC_CHAIN}/${url}`;
};


export const getHealth = async () => {
  const { data } = await axios.get(generateUrl(`health`));
  return data;
};


export const getStatusList = async (
  params: ListReq,
): Promise<any> => {
  const { data } = await axios.get(
    generateUrl(`tick/status?start=${params.start}&limit=${params.limit}`),
  );
  return data;
};

export const getNameList = async ({ start, limit }: any) => {
  const { data } = await axios.get(generateUrl(`ns/status?start=${start}&limit=${limit}`));
  return data;
};

export const getNftList = async ({
  start,
  limit,
}: any) => {
  const { data } = await axios.get(generateUrl(`nft/status?start=${start}&limit=${limit}`));
  return data;
};

export const getTickInfo = async ({ tick }: TokenInfoReq) => {
  const { data } = await axios.get(generateUrl(`tick/info/${tick}`));
  return data;
};

export const getTokenAddressSummaryList = async ({ address }: AddressReq): Promise<TokenBalanceSummaryListResp> => {
  const { data } = await axios.get(generateUrl(`address/summary/${address}`));
  return data;
};
export const getTokenHolderList = async ({ tick, start, limit }) => {
  const { data } = await axios.get(generateUrl(`tick/holders/${tick}?start=${start}&limit=${limit}`));
  return data;
};

export const getTokenAddressHistory = async ({
  address,
  ticker,
  start,
  limit,
}: TokenReq) => {
  const { data } = await axios.get(generateUrl(`address/history/${address}/${ticker}?start=${start}&limit=${limit}`));
  return data;
};

export const getTokenAddressHolders = async ({
  address,
  ticker,
  start,
  limit,
}: TokenReq) => {
  const { data } = await axios.get(
    generateUrl(`address/utxolist/${address}/${ticker}?start=${start}&limit=${limit}`),
  );
  return data;
};

export const getTokenHistory = async ({
  start,
  limit,
  ticker,
}: TokenReq) => {
  const { data } = await axios.get(generateUrl(`tick/history/${ticker}?start=${start}&limit=${limit}`));
  return data;
};

export const getUtxoByValue = async ({
  address,
  value = 600,
}: any) => {
  const { data } = await axios.get(generateUrl(`utxo/address/${address}/${value}`));
  return data;
};

// server端无此接口
export const savePaidOrder = async ({ key, content }: any) => {
  const { data } = await axios.post(generateUrl(`v1/indexer/tx/putkv/${key}`),
    {
      key,
      content: JSON.stringify(content),
    },
  );
  return data;
};

export const getInscriptiontInfo = async ({ inscriptionId }: any) => {
  const { data } = await axios.get(generateUrl(`mint/details/${inscriptionId}`));
  return data;
};

export const getAppVersion = async () => {
  const { data } = await axios.get(`/version.txt`);
  return data;
};



export const getSats = async ({ address }: any) => {
  const { data } = await axios.get(
    generateUrl(`exotic/address/${address}`),
  );
  return data;
};

export const getSplittedSats = async ({ ticker }: any) => {
  const { data } = await axios.get(generateUrl(`splittedInscriptions/${ticker}`));
  return data;
};

export const getAssetByUtxo = async ({ utxo }: any) => {
  const { data } = await axios.get(generateUrl(`utxo/abbrassets/${utxo}`),);
  return data;
};

export const getUtxoByType = async ({ address, type }: any) => {
  const { data } = await axios.get(generateUrl(`exotic/address/${address}/${type}`));
  return data;
};

export const getSatsByAddress = async ({ address, sats }: any) => {
  const { data } = await axios.post(generateUrl(`sat/FindSatsInAddress`), { address: address, sats: sats });
  return data;
};

export const getSatsByUtxo = async ({ utxo }: any) => {
  const { data } = await axios.get(generateUrl(`exotic/utxo/${utxo}`));
  return data;
};

export const getSatTypes = async () => {
  const { data } = await axios.get(generateUrl(`info/satributes`));
  return data;
};

export const getUtxo = async ({ utxo }: any) => {
  const { data } = await axios.get(generateUrl(`utxo/assets/${utxo}`));
  return data;
};

export const getOrdInscriptionsByAddress = async ({
  address,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(generateUrl(`nft/address/${address}?start=${start}&limit=${limit}`));
  return data;
};

export const getOrdInscriptionsBySat = async ({
  sat,
  start,
  limit,
}: any) => {
  const { data } = await axios.get(generateUrl(`nft/sat/${sat}?start=${start}&limit=${limit}`));
  return data;
};

export const getOrdInscription = async ({ inscriptionId }: any) => {
  const { data } = await axios.get(generateUrl(`nft/nftid/${inscriptionId}`));
  return data;
};

export const getAddressNameList = async ({
  address,
  start,
  limit,
}: AddressListReq): Promise<NameListResp> => {
  const { data } = await axios.get(generateUrl(`ns/address/${address}?start=${start}&limit=${limit}`), { timeout: 10000 });
  return data;
};

export const getNameInfo = async ({ name }: any) => {
  const { data } = await axios.get(generateUrl(`ns/name/${name}`));
  return data;
};

export const getBestHeight = async () => {
  const { data } = await axios.get(generateUrl(`bestheight`));
  return data;
};
export const getHeightInfo = async ({ height }: any) => {
  const { data } = await axios.get(generateUrl(`height/${height}`));
  return data;
};


// tx status
export const getTxStatus = async ({ txid, network }: TxStatusParams) => {
  const { data } = await axios.get(
    `https://blockstream.info/${network === 'testnet' ? 'testnet/' : ''
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