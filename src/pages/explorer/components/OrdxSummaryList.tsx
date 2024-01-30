import { useEffect, useMemo } from 'react';
import { OrdXItem } from './OrdXItem';
import { useOrdxSummary } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
import { on } from 'events';
interface Ord2SummaryListProps {
  address: string;
  onChange?: (tick: string) => void;
}
export const Ord2SummaryList = ({
  address,
  onChange,
}: Ord2SummaryListProps) => {
  const { network } = useUnisatConnect();
  const { data, trigger } = useOrdxSummary({ address, network });
  const list = useMemo(() => data?.data?.detail || [], [data]);
  const onClick = (item) => {
    console.log(item)
    onChange?.(item.ticker);
  };
  useEffect(() => {
    if (list.length) {
      onClick(list[0]);
    }
  }, [list]);
  useEffect(() => {
    if (address) {
      trigger();
    }
  }, [address ,network]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <OrdXItem
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
