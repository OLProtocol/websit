import { core } from '@unisat/wallet-sdk';

import { NetworkType } from '@/lib/types';

/**
 * Convert network type to bitcoinjs-lib network.
 */
export function toPsbtNetwork(networkType: NetworkType) {
  if (networkType === NetworkType.MAINNET) {
    return core.bitcoin.networks.bitcoin;
  } else if (networkType === NetworkType.TESTNET) {
    return core.bitcoin.networks.testnet;
  } else {
    return core.bitcoin.networks.regtest;
  }
}
