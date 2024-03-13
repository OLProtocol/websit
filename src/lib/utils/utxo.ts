import { sortBy, reverse, cloneDeep } from 'lodash';
export const filterUtxosByValue = (utxos: any[], value, reverseStatus = true) => {
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
    maxUtxo: sortUtxos[sortUtxos.length -1],
    utxos: avialableUtxo,
    total: avialableValue,
  };
};
