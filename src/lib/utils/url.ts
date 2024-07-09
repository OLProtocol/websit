export const genOrdServiceUrl = ({
  network,
  path,
  locale,
}: {
  network: string;
  path?: string;
  locale?: string;
}) => {
  const base = network === 'testnet' ? 'https://ord-testnet4.ordx.space' : 'https://ord-mainnet.ordx.space';
  let url = base;
  if (locale) {
    url += `/${locale}`;
  }
  if (path) {
    url += `/${path}`;
  }
  return url;
};

export const genOrdinalsUrl = ({
  network,
  path,
  locale,
}: {
  network: string;
  path?: string;
  locale?: string;
}) => {
  const base = network === 'testnet' ? 'https://testnet4.ordinals.com' : 'https://ordinals.com';
  let url = base;
  if (locale) {
    url += `/${locale}`;
  }
  if (path) {
    url += `/${path}`;
  }
  return url;
};
