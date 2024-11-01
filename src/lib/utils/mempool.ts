import { BtcNetwork } from "@/type";

export const generateMempoolUrl = ({
  network,
  path,
  locale,
}: {
  network: string;
  path?: string;
  locale?: string;
}) => {
  const base = 'https://mempool.space';
  let url = base;
  if (locale) {
    url += `/${locale}`;
  }
  if (network === 'testnet') {
    url += '/testnet4';
  }
  if (path) {
    url += `/${path}`;
  }
  return url;
};

export const fetchChainFeeRate = async (network: BtcNetwork) => {
  const url =
    network === 'testnet'
      ? 'https://mempool.space/testnet4/api/v1/fees/recommended'
      : 'https://mempool.space/api/v1/fees/recommended';
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};


