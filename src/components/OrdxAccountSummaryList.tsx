import { useEffect, useMemo, useState } from 'react';
import { OrdXItem } from './OrdXItem';
import { useOrdxSummary, useUtxoByValue } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
import { on } from 'events';
interface OrdxSummaryListProps {
  address: string;
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const OrdxAccountSummaryList = ({
  address,
  onChange,
  onEmpty,
}: OrdxSummaryListProps) => {
  const { network } = useUnisatConnect();
  const { data, trigger } = useOrdxSummary({ address, network });
  const {
    data: utxosRes,
    trigger: getUtxo,
  } = useUtxoByValue({
    address,
    network,
    value: 10,
  });
  const avialableTicker = useMemo(() => {
    const utxos = utxosRes?.data || [];
    const totalValue = utxos.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    return {
      ticker: '可花费utxo',
      balance: totalValue,
    };
  }, [utxosRes]);
  const [select, setSelect] = useState('');
  const arr = useMemo(() => data?.data?.detail || [], [data]);
  const list = useMemo(() => {
    return [avialableTicker, ...arr];
  }, [arr, avialableTicker]);
  const onClick = (item) => {
    setSelect(item.ticker);
    onChange?.(item.ticker);
  };
  useEffect(() => {
    if (list.length) {
      onClick(list[0]);
    }
  }, [list]);
  useEffect(() => {
    onEmpty?.(list.length === 0);
  }, [list]);
  useEffect(() => {
    if (address) {
      trigger();
      getUtxo();
    }
  }, [address, network]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <OrdXItem
          selected={select === item.ticker}
          onClick={() => {
            onClick(item);
          }}
          item={{
            tick: item.ticker,
            balance: item.balance,
          }}
        />
      ))}
    </div>
  );
};
