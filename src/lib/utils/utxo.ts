import { sortBy, reverse, cloneDeep } from 'lodash';
import { Address, Script } from '@cmdcode/tapscript';
import { type UnspentOutput } from '@unisat/wallet-sdk';

export interface Utxo {
  txid: string;
  vout: number;
  value: number;
}
export interface PsbtInput {
  hash: string;
  index: number;
  witnessUtxo: {
    script: Buffer;
    value: number;
  };
}
export interface PsbtOutput {
  address: string;
  value: number;
}
export type BtcUtxo = UnspentOutput;
export const addressToScriptPublicKey = (address: string) => {
  const scriptPublicKey = Script.fmt.toAsm(
    Address.toScriptPubKey(address),
  )?.[0];
  return scriptPublicKey;
};

export const convertUtxosToBtcUtxos = ({
  utxos,
  address,
  publicKey,
  addressType = 2,
}: {
  utxos: Utxo[];
  address: string;
  publicKey: string;
  addressType?: number;
}): UnspentOutput[] => {
  return utxos.map((v) => ({
    txid: v.txid,
    vout: v.vout,
    satoshis: v.value,
    addressType: addressType,
    pubkey: publicKey,
    scriptPk: addressToScriptPublicKey(address),
    inscriptions: [],
    atomicals: [],
  }));
};

export const convertBtcUtxosToInputs = (utxos: UnspentOutput[]): PsbtInput[] => {
  return utxos.map((v) => ({
    hash: v.txid,
    index: v.vout,
    witnessUtxo: {
      script: Buffer.from(v.scriptPk, 'hex'),
      value: v.satoshis,
    },
  }));
};
export const converUtxosToInputs = ({
  utxos,
  address,
}: {
  utxos: Utxo[];
  address: string;
}): PsbtInput[] => {
  return utxos.map((v) => ({
    hash: v.txid,
    index: v.vout,
    witnessUtxo: {
      script: Buffer.from(addressToScriptPublicKey(address), 'hex'),
      value: v.value,
    },
  }));
};

export const filterUtxosByValue = (
  utxos: any[],
  value,
  reverseStatus = true,
) => {
  const sortUtxos = sortBy(utxos, 'value');
  const _utxoList = cloneDeep(sortUtxos);
  if (reverseStatus) {
    reverse(_utxoList);
  }
  const avialableUtxo: any[] = [];
  let avialableValue = 0;
  for (let i = 0; i < _utxoList.length; i++) {
    const utxo = _utxoList[i];
    avialableUtxo.push(utxo);
    avialableValue += utxo.value;
    if (avialableValue >= value) {
      break;
    }
  }
  return {
    minUtxo: sortUtxos[0],
    maxUtxo: sortUtxos[sortUtxos.length - 1],
    utxos: avialableUtxo,
    total: avialableValue,
  };
};

export const calculateRate = (
  inputLength: number,
  outputLength: number,
  feeRate: number,
) => {
  return (148 * inputLength + 34 * outputLength + 10) * feeRate;
};
