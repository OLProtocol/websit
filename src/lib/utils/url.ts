export const generateOrdUrl = ({
  network,
  path,
  locale,
}: {
  network: string;
  path?: string;
  locale?: string;
}) => {
  const base = network === 'testnet'? 'https://ord-testnet4.ordx.space' : 'https://ord-mainnet.ordx.space';
  let url = base;
  if (locale) {
    url += `/${locale}`;
  }
  if (path) {
    url += `/${path}`;
  }
  return url;
};
