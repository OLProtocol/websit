import { useEffect, useMemo, useState } from 'react';
import { Sat20Item } from './OrdXItem';
import { useSat20Summary } from '@/api';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';

interface Sat20SummaryListProps {
  address: string;
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const Sat20SummaryList = ({
  address,
  onChange,
  onEmpty,
}: Sat20SummaryListProps) => {
  const { network } = useReactWalletStore();
  const { data, trigger } = useSat20Summary({ address, network });
  const [select, setSelect] = useState('');

  const list = useMemo(() => data?.data?.detail || [], [data]);
  // debugger;
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
    }
  }, [address, network]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <Sat20Item key={Math.random()}
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
