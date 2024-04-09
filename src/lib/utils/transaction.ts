import { transaction, wallet } from '@unisat/wallet-sdk';
import { type Utxo, BtcUtxo, PsbtInput, PsbtOutput } from './utxo';
import {
  converUtxosToInputs,
  convertUtxosToBtcUtxos,
  convertBtcUtxosToInputs,
} from './utxo';

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
  const { Transaction } = transaction;
  const tx = new Transaction();
  tx.setNetworkType(network == 'testnet' ? 1 : 0);
  tx.setFeeRate(feeRate);
  tx.setEnableRBF(true);
  tx.setChangeAddress(address);

  outputs.forEach((v) => {
    tx.addOutput(v.address, v.value);
  });

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
  // const inputs = convertBtcUtxosToInputs(btcUtxos);

  const { Transaction } = transaction;
  const tx = new Transaction();
  tx.setNetworkType(network == 'testnet' ? 1 : 0);
  tx.setFeeRate(feeRate);
  tx.setEnableRBF(true);
  tx.setChangeAddress(address);

  outputs.forEach((v) => {
    tx.addOutput(v.address, v.value);
  });

  await tx.addSufficientUtxosForFee(btcUtxos);

  const psbt = tx.toPsbt();
  return psbt;
};
