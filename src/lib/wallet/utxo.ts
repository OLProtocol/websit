import { sort } from 'radash';
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

export const convertBtcUtxosToInputs = (
  utxos: UnspentOutput[],
): PsbtInput[] => {
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

/**
 * `filterUtxosByValue`函数用于过滤一个UTXO列表，根据指定的值进行过滤，并返回所选UTXO的最小和最大UTXO以及所选UTXO的总值。
 * @param {any[]} utxos - `filterUtxosByValue`函数的`utxos`参数是一个包含未花费的交易输出（UTXO）的数组，你想要根据指定的值对其进行过滤。数组中的每个UTXO对象都应该具有一个`value`属性，表示金额。
 * @param value - `filterUtxosByValue`函数的`value`参数表示你想要按照指定的值对UTXO进行过滤的目标值。函数会遍历UTXO列表，选择总值大于或等于指定`value`的UTXO。
 * @param [reverseStatus=true] - `filterUtxosByValue`函数的`reverseStatus`参数是一个布尔参数，它决定了在进一步处理之前是否应该反转排序的UTXO列表。如果`reverseStatus`被设置为`true`，则会反转排序的UTXO列表；否则，不会。
 * @returns `filterUtxosByValue`函数返回一个具有以下属性的对象：
 * - `minUtxo`：输入数组`utxos`中的最小UTXO。
 * - `maxUtxo`：输入数组`utxos`中的最大UTXO。
 * - `utxos`：总值大于或等于指定`value`的UTXO数组。
 */
export const filterUtxosByValue = (utxos: any[], value, reverseStatus = true) => {
  const sortUtxos = sort(utxos, (u) => u.value);
  const _utxoList = structuredClone(sortUtxos);
  if (reverseStatus) {
    _utxoList.reverse();
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