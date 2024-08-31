import { useNetwork } from './network';
import { Transaction } from '.';
import { NetworkType } from '@/lib/types';

import { type Utxo, BtcUtxo, PsbtInput, PsbtOutput } from './utxo';
import {
  converUtxosToInputs,
  convertUtxosToBtcUtxos,
  convertBtcUtxosToInputs,
} from './utxo';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';


export const calcNetworkFee = async ({
  utxos,
  outputs,
  feeRate,
  network,
  address,
  publicKey,
}: {
  utxos: Utxo[];
  outputs: PsbtOutput[];
  feeRate: number;
  network: string;
  address: string;
  publicKey: string;
}) => {
  const btcUtxos = convertUtxosToBtcUtxos({
    utxos,
    address,
    publicKey,
  });
  const tx = new Transaction({
    address,
    network: network == 'testnet' ? NetworkType.TESTNET : NetworkType.MAINNET,
    feeRate,
  });
  tx.setNetworkType(network == 'testnet' ? 1 : 0);
  tx.setFeeRate(feeRate);
  tx.setEnableRBF(true);
  tx.setChangeAddress(address);

  outputs.forEach((v) => {
    tx.addOutput(v.address, v.value);
  });
  console.log(btcUtxos);
  await tx.addSufficientUtxosForFee(btcUtxos);
  const fee = await tx.calNetworkFee();
  return fee;
};

export const buildTransaction = async ({
  utxos,
  outputs,
  feeRate,
  network,
  address,
  publicKey,
  suitable,
}: {
  utxos: Utxo[];
  outputs: PsbtOutput[];
  feeRate: number;
  network: string;
  address: string;
  publicKey: string;
  suitable?: boolean;
}) => {
  const btcUtxos = convertUtxosToBtcUtxos({
    utxos,
    address,
    publicKey,
  });

  const tx = new Transaction({
    address,
    network: network == 'testnet' ? NetworkType.TESTNET : NetworkType.MAINNET,
    feeRate,
  });
  console.log(btcUtxos);
  tx.setEnableRBF(true);

  outputs.forEach((v) => {
    tx.addOutput(v.address, v.value);
  });
  await tx.addSufficientUtxosForFee(btcUtxos, {
    suitable,
  });

  const psbt = tx.toPsbt();
  return psbt;
};

export const signAndPushPsbt = async (psbt) => {
  const { btcWallet } = useReactWalletStore.getState();
  if (!btcWallet) {
    throw new Error('No wallet connected');
  }
  const signed = await btcWallet.signPsbt(psbt.toHex());
  if (!signed) {
    throw new Error('Sign failed');
  }
  const pushedTxId = await btcWallet.pushPsbt(signed);
  return pushedTxId;
};
