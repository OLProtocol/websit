import { useEffect, useMemo, useState } from 'react';
import { Sat20Item } from './Sat20Item';

import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useNetwork } from '@/lib/wallet';
import { useTokenBalanceSummaryListHook } from '@/hooks/TokenBalanceSummaryList';

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
  const network = useNetwork();
  const { value } = useTokenBalanceSummaryListHook({ address });
  const [select, setSelect] = useState('');

  const list = useMemo(() => value?.data?.detail || [], [value]);
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
