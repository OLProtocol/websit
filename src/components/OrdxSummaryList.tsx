import { useEffect, useMemo, useState } from 'react';
import { OrdXItem } from './OrdXItem';
import { useOrdxSummary } from '@/api';
import { useReactWalletStore } from 'btc-connect/dist/react';

interface OrdxSummaryListProps {
  address: string;
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const OrdxSummaryList = ({
  address,
  onChange,
  onEmpty,
}: OrdxSummaryListProps) => {
  const { network } = useReactWalletStore();
  const { data, trigger } = useOrdxSummary({ address, network });
  const [select, setSelect] = useState('');
  const list = useMemo(() => data?.data?.detail || [], [data]);

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
        <OrdXItem key={Math.random()}
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
