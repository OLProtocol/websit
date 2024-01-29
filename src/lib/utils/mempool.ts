
export const fetchTipHeight = async (network: 'main' | 'testnet') => {
  const url =
    network === 'testnet'
      ? 'https://mempool.space/testnet/api/blocks/tip/height'
      : 'https://mempool.space/api/blocks/tip/height';
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};
export const fetchChainFeeRate = async (network: 'main' | 'testnet') => {
  const url =
    network === 'testnet'
      ? 'https://mempool.space/testnet/api/v1/fees/recommended'
      : 'https://mempool.space/api/v1/fees/recommended';
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};