import { useEffect, useMemo } from 'react';
import { OrdXItem } from './OrdXItem';
import { useOrdxSummary } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
interface Ord2SummaryListProps {
  address: string;
}
export const Ord2SummaryList = ({ address }: Ord2SummaryListProps) => {
  const { network} = useUnisatConnect();
  const { data, trigger } = useOrdxSummary({ address, network });
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
