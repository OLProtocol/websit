import { useEffect, useMemo } from 'react';
import { OrdXItem } from './OrdXItem';
import { useOrdXSummary } from '@/api';
interface Ord2SummaryListProps {
  address: string;
}
export const Ord2SummaryList = ({ address }: Ord2SummaryListProps) => {
  const { data, trigger } = useOrdXSummary({ address });
  const list = useMemo(() => data?.detail || [], [data]);
  useEffect(() => {
    if (address) {
      trigger();
    }
  }, [address]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <OrdXItem
          item={{
            tick: item.ticker,
            balance: item.balance,
          }}
        />
      ))}
    </div>
  );
};
