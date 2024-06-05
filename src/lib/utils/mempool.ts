
export const fetchTipHeight = async (network: 'main' | 'testnet') => {
  const url =
    network === 'testnet'
      ? 'https://mempool.space/testnet4/api/blocks/tip/height'
      : 'https://mempool.space/api/blocks/tip/height';
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};
export const fetchChainFeeRate = async (network: 'main' | 'testnet') => {
  const url =
    network === 'testnet'
      ? 'https://mempool.space/testnet4/api/v1/fees/recommended'
      : 'https://mempool.space/api/v1/fees/recommended';
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};
interface TxInfoParams {
  txid: string;
  network: 'main' | 'testnet';
}
export const fetchTxHex = async ({ network, txid}: TxInfoParams) => {
  // const { bitcoin: { fees } } = mempoolJS({
  //   hostname: 'mempool.space',
  //   network,
  // });

  // const data = await fees.getFeesRecommended();
  // return data;
  const url =
    network === 'testnet'
      ? `https://mempool.space/testnet4/api/tx/${txid}/hex`
      : `https://mempool.space/api/tx/${txid}/hex`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};