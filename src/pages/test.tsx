import { Button } from 'antd';
import { sort } from 'radash';
import { SatsRangeShow } from '@/components/SatsRangeShow';
export default function Test() {
  const filterUtxosByValue = (utxos: any[], value, reverseStatus = true) => {
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

  const testHandler = async () => {
    console.log(
      filterUtxosByValue(
        [
          {
            txid: 123123123,
            vout: 0,
            value: 10000,
          },
          {
            txid: 12123223,
            vout: 0,
            value: 100200,
          },
          {
            txid: 22222222,
            vout: 0,
            value: 1100,
          },
        ],
        600,
      ),
    );
  };
  return (
    <>
      <SatsRangeShow />
      <Button onClick={testHandler}>Test</Button>
    </>
  );
}
